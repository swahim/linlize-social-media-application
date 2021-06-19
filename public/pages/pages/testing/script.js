const btn=document.querySelector('.button');
btn.addEventListener("click",(e)=>{
    e.preventDefault();
    fetch("localhost:8000/auth/cookie-testing",{
        method: "GET",
        credentials: 'include',
    })
})