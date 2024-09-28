
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()

  
  document.getElementById('booking-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const bookingData = {
        checkinDate: document.getElementById('checkin-date').value,
        checkoutDate: document.getElementById('checkout-date').value,
        guests: document.getElementById('guests').value,
        fullName: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        listingId: document.querySelector('input[name="listingId"]').value
    };

    try {
        const response = await fetch('/api/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            window.location.href = `/listings/${bookingData.listingId}`; // Redirect to the listing's show page
        } else {
            alert(result.error || 'An error occurred while creating the booking.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while processing your request.');
    }
});

