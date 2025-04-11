<?php
$filename = "../data/puntajes.json";
$data = file_get_contents($filename);
$puntajes = json_decode($data, true);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Actualizar puntajes
    $equipo = $_POST['equipo'];
    $puntos = $_POST['puntos'];
    if (isset($puntajes[$equipo])) {
        $puntajes[$equipo] += $puntos;
    }
    // Guardar los puntajes actualizados
    file_put_contents($filename, json_encode($puntajes));
}

echo json_encode($puntajes);
?>
