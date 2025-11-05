$(document).ready(function(){
    mostrarUsuarios();

    //Crear usuario
    $('#btnCrear').click(function(){
        // Validación del lado del cliente
        var nombre = $('#nombre').val().trim();
        var correo = $('#correo').val().trim();
        
        if(nombre === '' || correo === '') {
            alert('El nombre y correo son obligatorios');
            return;
        }

        var datosForm = new FormData();
        datosForm.append('accion', 'crear');
        datosForm.append('nombre', nombre);
        datosForm.append('correo', correo);
        datosForm.append('imagen',$('#imagen')[0].files[0]);

        $.ajax({
            url: 'crud.php',
            type: 'POST',
            data: datosForm,
            contentType: false,
            processData: false,
            success: function(response) {
                alert(response);
                limpiarFormulario();
                mostrarUsuarios();
            }
        });
    });

    //Mostrar usuarios
    function mostrarUsuarios() {
        $.ajax({
            url: 'crud.php',
            type: 'POST',
            data: { accion: 'mostrar'},
            success: function (response) {
                $('#tablaUsuarios').html(response);
            }
        });
    }
    
    //Eliminar usuario
    $(document).on('click', '.eliminar', function(){
        var id = $(this).data('id');
        if (confirm('Seguro que deseas eliminar este usuario?')) {
            $.ajax({
                url: 'crud.php',
                type: 'POST',
                data: { accion: 'eliminar', id: id},
                success: function(response) {
                    alert(response);
                    mostrarUsuarios();
                }
            });
        }
    });

    //Cargar datos para editar
    $(document).on('click','.editar', function() {
        var id = $(this).data('id');
        $.ajax({
            url: 'crud.php',
            type: 'POST',
            data: { accion: 'obtener', id: id },
            dataType: 'json',
            success: function(usuario) {
            $('#id').val(usuario.id);
            $('#nombre').val(usuario.nombre);
            $('#correo').val(usuario.correo);
            $('#btnCrear').hide();
            $('#btnActualizar').show();
            }
        });
    });

    //Actualizar usuario
    $('#btnActualizar').click(function(){
        var datosForm = new FormData();
        datosForm.append('accion', 'actualizar');
        datosForm.append('id', $('#id').val());
        datosForm.append('nombre', $('#nombre').val());
        datosForm.append('correo', $('#correo').val());
        datosForm.append('imagen', $('#imagen')[0].files[0]);

        $.ajax({
            url: 'crud.php',
            type: 'POST',
            data: datosForm,
            contentType: false,
            processData: false,
            success: function(response) {
                alert(response);
                limpiarFormulario();
                mostrarUsuarios();
            }
        });
    });

    //Limpiar formulario
    function limpiarFormulario() {
        $('#id').val('');
        $('#nombre').val('');
        $('#correo').val('');
        $('#imagen').val('');
        $('#btnCrear').show();
        $('#btnActualizar').hide();
    }
});
