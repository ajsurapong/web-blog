$(document).ready(function () {
    $("#btnSignIn").click(function () {
        const username = $("#txtUsername").val();
        const password = $("#txtPassword").val();

        // alert(username + " " + password);
        $.ajax({
            type: "POST",
            url: "/login",
            data: {username: username, password: password},
            success: function (response) {
                alert(response);
            },
            error: function(xhr) {
                alert(xhr.responseText);
            }
        });
    });
});