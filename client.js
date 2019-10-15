 // Socket.io setup
 const socket = io('http://192.168.1.33:3030');
 // Init feathers app
 const app = feathers();
 // Register socket.io to talk to server
 app.configure(feathers.socketio(socket));
 document.getElementById('form').addEventListener('submit', sendIdea);
 async function sendIdea(e) {
   e.preventDefault();
   const text = document.getElementById('idea-text');
   const tech = document.getElementById('idea-tech');
   const viewer = document.getElementById('idea-viewer');
   // Create new idea

    console.log('text :', text.value);

   app.service('ideas').create({
     text: text.value,
     tech: tech.value,
     viewer: viewer.value
   });
   // Clear inputs
   text.value = '';
   tech.value = '';
   viewer.value = '';
 }
 function renderIdea(idea) {
   document.getElementById(
     'ideas'
   ).innerHTML += 
   `<li class="shadow rounded bg-gray-200 w-full p-4 lg:mx-4 mt-2">
        <h1 class="text-lg">${idea.text}</h1>
        <h1 class="text-lg">${idea.tech}</h1>
        <p>Submitted by ${idea.viewer}</p>
        <p class="pb-1">Time : ${idea.time}</p>
    </li>` 
 }
 async function init() {
   // Find ideas
   const ideas = await app.service('ideas').find();
   // Add existing ideas to list
   ideas.forEach(renderIdea);
   // Add idea in realtime
   app.service('ideas').on('created', renderIdea);
 }
 init();