document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', async(event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = new URLSearchParams(formData);

        try{
            const response = await fetch('/login', {
                method: 'POST',
                body: data,
            });
            if(response.ok){
                const result = await response.text();
                alert(result);
                window.location.href = '/profile';
            }
            else{
                const errorText = await response.text();
                alert(errorText);    
            }
        }
        catch(error){
            console.error('Error:', error);
            alert('An unexpected error occured.');
        }
    });
});