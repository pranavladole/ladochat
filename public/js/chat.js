const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationFormButton = document.querySelector('#sendLocation')
const $messages = document.querySelector('#messages')
const $locationMessage = document.querySelector('#locationMessage')


//template
const messageTemplate = document.querySelector('#message-template').innerHTML
const messageTemplate1 = document.querySelector('#message-template1').innerHTML

//options

const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})


socket.on('message',(message)=>{
    console.log(message);
    const html = Mustache.render(messageTemplate , {
      username : message.username,
      message : message.text,
      createdAt : moment(message.createdAt).format('hh-mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
}  
)

socket.on('locationMessage' , (message)=>{

const html = Mustache.render(messageTemplate1 , {
  username:message.username,
  url : message.url,
  createdAt: moment(message.createdAt).format('hh-mm a')
})
$messages.insertAdjacentHTML('beforeend',html)
})


$messageForm.addEventListener('submit',(e)=>{
e.preventDefault()

$messageFormButton.setAttribute('disabled','disabled')

const message = e.target.elements.message.value
socket.emit('sendMessage' , message , (error)=>{
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()

    if(error){
    console.log(error);}
})
console.log("message delivered");

})




$locationFormButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
       return alert('geolocation not supported')
    }
    $locationFormButton.setAttribute('disabled','disabled')
   navigator.geolocation.getCurrentPosition((position)=>{
       socket.emit('sendLocation',  {
     latitude : position.coords.latitude,
     longitude : position.coords.longitude
       }, ()=>{
           $locationFormButton.removeAttribute('disabled')
           console.log("Location shared");
       }
       
    )}
  )
})

socket.emit('join',{username,room} , (error)=>{
  if(error){
    alert(error)
      location.href ='/'
  }
})