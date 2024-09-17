document.addEventListener('DOMContentLoaded', ()=> {
    const form = document.getElementById('profileForm');

    form.addEventListener('submit', async(event) => {
        event.preventDefault();

        const formData = new FormData(form);
        // convert FormData to a plain object for logging
        const dataObject = {};
        formData.forEach((value, key) => {
            dataObject[key] = value;
        });

        // Log data for debugging
        console.log('Form Data:', dataObject);

        try{
            const response = await fetch('/profile', {
                method: 'POST',
                // body: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(dataObject).toString(),
            });
            if(response.ok){
                const result = await response.text();
                alert(result);
            }
            else{
                const errorText = await response.text();
                alert(`Profile update failed: ${errorText}`);
            }
        }
        catch(error){
            console.error('Error:', error);
            alert('An unexpected error occured.');
        }
    });
}); 