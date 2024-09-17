document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');

    form.addEventListener('submit', async(event) => {
        event.preventDefault(); // Prevent Default Form Submission

        const formData = new FormData(form);
        const data = new URLSearchParams(formData);

        try{
            const response = await fetch('/signup', {
                method: 'POST',
                body: data,
            });
            if(response.ok){
                const result = await response.text();
                alert(result); // show success message
                window.location.href = '/login';
            }
            else{
                alert('There was an error with the submission.');
            }
        }
        catch(error){
            console.error('Error:', error);
            alert('An unexpected error occured.');
        }
    });
});