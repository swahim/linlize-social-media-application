function signInSuccess() {
  Swal.fire({
    title: "Success!",
    text: "Sign in successfull!",
    // type: "error",
    icon: "success",
    confirmButtonText: "Cool",
  });
}
export function serverError() {
  Swal.fire({
    icon: "error",
    title: "OOPS...",
    text: "Server Error Occured!",
    // footer: '<a href="">Why do I have this issue?</a>',
  });
}

function areYouSureYouWantToDelete() {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Deleted!", "Your file has been deleted.", "success");
    }
  });
}

function areYouSureYouWantToDelete2() {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          "Deleted!",
          "Your file has been deleted.",
          "success"
        );
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          "Cancelled",
          "Your imaginary file is safe :)",
          "error"
        );
      }
    });
}

function feedback() {
  const { value: text } =  Swal.fire({
    input: "textarea",
    inputLabel: "Message",
    inputPlaceholder: "Type your message here...",
    inputAttributes: {
      "aria-label": "Type your message here",
    },
    showCancelButton: true,
  });

  if (text) {
    Swal.fire(text);
  }
}
