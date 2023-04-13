
document.addEventListener('DOMContentLoaded',()=>{
    document.querySelector('#newPost').addEventListener('submit',createPost);
   document.querySelectorAll('.icon').forEach(i=> i.addEventListener('click',function(){like(i)}))
})

function createPost(e){
    e.preventDefault()
   content=document.querySelector('#postContent')
   btn=document.querySelector('#submitBtn').disabled=true
   

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
    if(message.error){
        console.log(message.error);
        return;
    }
    
    window.location.reload();
    
  })
  
}

function like(i){
    let counter= i.previousElementSibling
    console.log(counter);

  if(i.classList.contains("fa-regular")){
    i.classList.remove("fa-regular")
    i.classList.add("fa-solid")
    counter.innerHTML = parseInt(counter.innerText) + 1;
  }else if(i.classList.contains("fa-solid")){
    i.classList.remove("fa-solid")
    i.classList.add("fa-regular")
    counter.innerText = parseInt(counter.innerText) - 1;
  }
  const id=Number(i.dataset.id)

  fetch('/like',{
    method:'POST',
    body:JSON.stringify({
      id:id
    })
  })
  .then(response=>response.json())
  .then(message=>{
    
  })
  
}