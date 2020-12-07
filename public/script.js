const socket  = io('/');
const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer(undefined,{
    host : "/",
    port: "3001"
});


const myVideo = document.createElement('video');
//myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio:true 
}).then(stream => {
    addVideoStream(myVideo, stream)
    mute
    myPeer.on('call', call =>{
    console.log('koko');        
        call.answer(stream)
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
})
myPeer.on('open',id => {
    
    socket.emit('join-room', ROOM_ID ,id)

})



socket.on('user-connected', userId =>{
    
    console.log('user connected '+ userId);
})

function addVideoStream(video, stream) {
    video.srcObject = stream;
    console.log(video.srcObject);
    video.addEventListener('loadmetadata', ()=>{
        video.play()
    })
    videoGrid.append(video)
  }

function connectToNewUser(userId,stream){
    
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video , userVideoStream)
    })
    call.on('close', ()=>{
        video.remove()
    })

}