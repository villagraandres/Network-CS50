
document.addEventListener('DOMContentLoaded',()=>{
    document.querySelector('#newPost').addEventListener('submit',createPost);
})

function createPost(e){
    e.preventDefault()
   content=document.querySelector('#postContent')

  if(content.value == ''){
    content.classList.add('border-danger');
    setTimeout(() => {
        content.classList.remove('border-danger');
    }, 2000);
        return;
  }

  fetch('/post',{
    method:'POST',
    body:JSON.stringify({content:content.value})
  })
  .then(response=>response.json())
  .then(message=>{
    if(message.error !== ''){
        console.log('Error');
        return;
    }
    
    
  })
  
}