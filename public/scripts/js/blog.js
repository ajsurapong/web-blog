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

    // global variables to separate between 'add' and 'edit'    
    var mode = "";
    var blogID = 0;
    // Add button
    $("#btnAdd").click(function () { 
        mode = "add";
        // change the modal title
        $("#modalTitle").text("Add new post");
        // clear data
        $("#txtTitle").val("");
        $("#txtDetail").val("");
        // show modal
        $("#modalAdd").modal("toggle");
    });

    // Save button for both 'add' and 'edit'
    $("#btnModalSave").click(function () { 
        // close modal
        $("#modalAdd").modal("toggle");

        // add       
        let data = {
            title: $("#txtTitle").val(),
            detail: $("#txtDetail").val()
        };
        let method = "POST";
        let url = "/blog/new";
        
        // edit
        if(mode == "edit") {
            data = {
                title: $("#txtTitle").val(),
                detail: $("#txtDetail").val(),
                blogID: blogID
            };
            method = "PUT";
            url = "/blog/edit";
        }       

        $.ajax({
            type: method,
            url: url,
            data: data,
            success: function (response) {
                window.location.replace(response);
            },
            error: function(xhr) {
                Swal.fire({
                    icon: "error",
                    title: xhr.responseText,
                });
            }
        });
    });

    // Edit button
    $(".btnEdit").click(function () { 
        mode = "edit";
        // change the modal title
        $("#modalTitle").text("Edit a post");
        // show modal
        $("#modalAdd").modal("toggle");
        // get selected post data
        const postData = JSON.parse($(this).attr("blogData"));
        // console.log(postData);
        $("#txtTitle").val(postData.title);
        $("#txtDetail").val(postData.detail);
        blogID = postData.blogID;        
    });
});