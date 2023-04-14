
document.addEventListener('DOMContentLoaded',()=>{
    const form=document.querySelector('#newPost')
    if(form){ form.addEventListener('submit',createPost) }
    
    document.querySelectorAll('.icon').forEach(i=> i.addEventListener('click',function(){like(i)}))

    const exampleModal = document.getElementById('exampleModal');
    if(exampleModal){exampleModal.addEventListener('show.bs.modal',edit )}

   const followBtn =document.getElementById('follow')
   if(followBtn){
    followBtn.addEventListener('click',follow)
   }

   const deleteBtn=document.querySelectorAll('.deleteBtn');
   if(deleteBtn){
    deleteBtn.forEach(btn=>btn.addEventListener('click',()=>{deletePost(btn.dataset.id)}))
   }
  
  



})

function createPost(e){
    e.preventDefault();

    content=document.querySelector('#postContent')
    if(content.value.trim() == ''){
      content.classList.add('border-danger');
      setTimeout(() => {
          content.classList.remove('border-danger');
      }, 2000);
          return;
    }

   
    btn=document.querySelector('#submitBtn').disabled=true
 
   const id=document.querySelector('#modalId').value;
 


  

  fetch('/post',{
    method:'POST',
    body:JSON.stringify({content:content.value,id:id})
  })
  .then(response=>response.json())
  .then(message=>{
    if(message.error){
        console.log(message.error);
        return;
    }
    
    window.location.reload();
    btn=document.querySelector('#submitBtn').disabled=false
     
  })
  
}

function like(i){
    let counter= i.previousElementSibling
    

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
function edit(e){
  // Button that triggered the modal
  const button = e.relatedTarget
  // Extract info from data-bs-* attributes
 const content=button.dataset.content;
 const id=button.dataset.id;
 if(!content){
  document.querySelector('#modalId').value='';
  exampleModal.querySelector('#postContent').value='';
  return;
 }

 const modalBodyInput = exampleModal.querySelector('#postContent')
 document.querySelector('#modalId').value=id
 modalBodyInput.value=content
}

function follow(e){

  const id=document.querySelector('#profileId').value;

  fetch('/follow',{
    method:'POST',
    body:JSON.stringify({id:id})
  })
  .then(response=>response.json())
  .then(message=>{
     window.location.reload()
  })

}

function deletePost(id){
  

  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {

      fetch('/delete',{
        method:'POST',
        body:JSON.stringify({id:id})
      })
      .then(response=>response.json())
      .then(message=>{
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        
      })
      
    }
  })

  
}