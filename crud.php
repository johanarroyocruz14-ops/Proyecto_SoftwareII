<?php 
// Mostrar errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include("conexion.php");

$accion = $_POST['accion'] ?? '';

if ($accion == 'crear') {
    $nombre = $_POST['nombre'];
    $correo = $_POST['correo'];
    $imagen = '';

    if(!empty($_FILES['imagen']['name'])) {
        $imagen = 'imagenes/' . basename($_FILES['imagen']['name']);
        move_uploaded_file($_FILES['imagen']['tmp_name'], $imagen);
    }

    $sql = "INSERT INTO usuarios (nombre, correo, imagen) VALUES ('$nombre', '$correo', '$imagen')";
    echo ($conexion->query($sql)) ? "Usuario creado correctamente" : "Error: " . $conexion->error;
}

if ($accion == 'mostrar') {
    $resultado = $conexion->query("SELECT * FROM usuarios ORDER BY id DESC");
    while ($fila = $resultado->fetch_assoc()) {
        $img = $fila['imagen'] ? $fila['imagen'] : 'https://via.placeholder.com/50';
        echo("<tr>
                <td><img src='$img' width='50'></td>
                <td>{$fila['nombre']}</td>
                <td>{$fila['correo']}</td>
                <td>
                    <button class='editar' data-id='{$fila['id']}'>Editar</button>
                    <button class='eliminar' data-id='{$fila['id']}'>Eliminar</button>
                </td>
            </tr>");
    }
}

if ($accion == 'eliminar') {
    $id = $_POST['id'];
    $conexion->query("DELETE FROM usuarios WHERE id=$id");
    echo ("Usuario eliminado correctamente");
}

if ($accion == 'actualizar') {
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $correo = $_POST['correo'];
    $imagen = '';

    if (!empty($_FILES['imagen']['name'])) {
        $imagen = 'imagenes/' . basename($_FILES['imagen']['name']);
        move_uploaded_file($_FILES['imagen']['tmp_name'], $imagen);
        $sql = "UPDATE usuarios SET nombre ='$nombre', correo='$correo', imagen='$imagen' WHERE id=$id";
    } else {
        $sql = "UPDATE usuarios SET nombre='$nombre', correo='$correo' WHERE id=$id";
    }

    echo ($conexion->query($sql))
    ? "Usuario actualizado correctamente"
    : "Error: " . $conexion->error;
}

// Obtener usuario por id (para editar)
if ($accion == 'obtener') {
    $id = $_POST['id'];
    $resultado = $conexion->query("SELECT * FROM usuarios WHERE id=$id LIMIT 1");
    if ($fila = $resultado->fetch_assoc()) {
        echo json_encode($fila);
    } else {
        echo json_encode(null);
    }
}
?>