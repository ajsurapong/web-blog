$(document).ready(function () {
    // Year drop down
    $("#selectYear").change(function () {
        const year = $(this).val();

        if(year == "all") {
            window.location.href = "/blog";
        }
        else {
            window.location.href = `/blog/${year}`;
        }
    });

    // Delete button
    $(".btnDelete").click(function () { 
        const blogID = $(this).attr("blogID");
        // alert(blogID);
        Swal.fire({
            icon: "warning",
            title: "Delete this post?",
            showCancelButton: true,
            confirmButtonText: "Yes",
        }).then(function(result) {
            if(result.isConfirmed) {
                // console.log("delete");
                $.ajax({
                    type: "DELETE",
                    url: `/blog/${blogID}`,
                    //url: "/blog/" + blogID,
                    success: function (response) {
                        window.location.replace(response);
                        // window.location.reload();
                    },
                    error: function(xhr) {
                        Swal.fire({
                            icon: "error",
                            title: xhr.responseText,
                        });
                    }
                });
            }
        });
    });
});