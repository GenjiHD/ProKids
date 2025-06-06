import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

// Modelo de datos
class RespuestaUsuario {
  final String UsuarioID;
  final String ActividadID;
  final String Fecha;
  final int Tiempo;
  final dynamic Respuesta;

  RespuestaUsuario({
    required this.UsuarioID,
    required this.ActividadID,
    required this.Fecha,
    required this.Tiempo,
    required this.Respuesta,
  });

  Map<String, dynamic> toJson() => {
    'UsuarioID': UsuarioID,
    'ActividadID': ActividadID,
    'Fecha': Fecha,
    'Tiempo': Tiempo,
    'Respuesta': Respuesta,
  };
}

// Servicio para guardar respuestas
class RespuestaService {
  static const String _baseUrl = 'https://prokids-b0ri.onrender.com/api/progreso';

  static Future<bool> guardarRespuesta(RespuestaUsuario respuesta) async {
    try {
      final body = respuesta.toJson();
      print('📤 Enviando datos exactos: $body');

      final response = await http.post(
        Uri.parse(_baseUrl),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(body),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        print('✅ Respuesta guardada: ${response.body}');
        return true;
      } else {
        print(
          '❌ Error del servidor: ${response.statusCode} - ${response.body}',
        );
        return false;
      }
    } catch (e) {
      print('❌ Error de conexión: $e');
      return false;
    }
  }
}

// Pantalla principal
class ActivityDetailScreen extends StatefulWidget {
  final Map<String, dynamic> activity;

  const ActivityDetailScreen({super.key, required this.activity});

  @override
  _ActivityDetailScreenState createState() => _ActivityDetailScreenState();
}

class _ActivityDetailScreenState extends State<ActivityDetailScreen> {
  final TextEditingController _answerController = TextEditingController();
  String _feedbackMessage = "";
  String? userId;
  late DateTime _startTime;

  late final bool esOpcionMultiple;
  late final List<dynamic> opciones;
  String? _respuestaSeleccionada;

  @override
  void initState() {
    super.initState();
    _startTime = DateTime.now();
    _loadUserId();

    esOpcionMultiple = widget.activity['TipoActividad'] == 'opcion_multiple';
    opciones = widget.activity['Opciones'] ?? [];
  }

  Future<void> _loadUserId() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      userId = prefs.getString('userId');
    });
  }

  Future<void> _verifyAnswer() async {
    final actividadId = widget.activity["id"];
    if (actividadId == null || userId == null) {
      print("❌ Falta el ID de la actividad o del usuario");
      return;
    }

    final respuestaUsuario =
        esOpcionMultiple
            ? _respuestaSeleccionada?.trim() ?? ''
            : _answerController.text.trim();

    if (respuestaUsuario.isEmpty) {
      setState(() {
        _feedbackMessage = "⚠️ Ingresa una respuesta para continuar.";
      });
      return;
    }

    final uri = Uri.parse('https://prokids-b0ri.onrender.com/api/activities/$actividadId');

    try {
      final response = await http.get(uri);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final respuestaEsperadaRaw = data["RespuestaEsperada"];

        if (respuestaEsperadaRaw == null) {
          setState(() {
            _feedbackMessage = "❌ La respuesta correcta no está disponible.";
          });
          return;
        }

        final respuestaEsperada = respuestaEsperadaRaw.toString().trim();
        final esCorrecto =
            respuestaUsuario.toLowerCase() == respuestaEsperada.toLowerCase();

        setState(() {
          _feedbackMessage =
              esCorrecto
                  ? "✅ ¡Correcto! Progreso guardado."
                  : "❌ Incorrecto, intenta de nuevo.";
        });

        if (esCorrecto) {
          await _guardarProgreso(respuestaUsuario);
        }
      } else {
        print("❌ Error al obtener la actividad: ${response.statusCode}");
        setState(() {
          _feedbackMessage = "❌ No se pudo verificar la respuesta.";
        });
      }
    } catch (e) {
      print("❌ Error de red al verificar respuesta: $e");
      setState(() {
        _feedbackMessage = "❌ Error de conexión al verificar respuesta.";
      });
    }
  }

  Future<void> _guardarProgreso(String respuesta) async {
    final tiempoTotal = DateTime.now().difference(_startTime).inSeconds;
    final fechaActual = _formatearFecha(DateTime.now());

    if (userId == null) {
      print("❌ userId es null");
      return;
    }

    final progreso = RespuestaUsuario(
      UsuarioID: userId!,
      ActividadID: widget.activity["id"]?.toString() ?? '',
      Fecha: fechaActual,
      Tiempo: tiempoTotal,
      Respuesta: respuesta,
    );

    final success = await RespuestaService.guardarRespuesta(progreso);

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Progreso guardado correctamente')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error al guardar el progreso')),
      );
    }
  }

  String _formatearFecha(DateTime fecha) {
    final dia = fecha.day.toString().padLeft(2, '0');
    final mes = fecha.month.toString().padLeft(2, '0');
    final anio = fecha.year.toString().substring(2); // formato aa
    return "$dia-$mes-$anio";
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.activity['Nombre'] ?? "Ejercicio")),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.activity['Descripcion'] ?? "Sin descripción",
              style: const TextStyle(fontSize: 18),
            ),
            const SizedBox(height: 20),
            if (!esOpcionMultiple) ...[
              
            ],
            esOpcionMultiple
                ? Column(
                  children:
                      opciones.map<Widget>((opcion) {
                        return RadioListTile<String>(
                          title: Text(opcion),
                          value: opcion,
                          groupValue: _respuestaSeleccionada,
                          onChanged: (value) {
                            setState(() {
                              _respuestaSeleccionada = value;
                            });
                          },
                        );
                      }).toList(),
                )
                : TextField(
                  controller: _answerController,
                  decoration: const InputDecoration(
                    labelText: "Tu respuesta aquí",
                    alignLabelWithHint: true, // Alinea el label con el texto multilínea
                    border: OutlineInputBorder(), // Opcional: añade un borde definido
                  ),
                  keyboardType: TextInputType.multiline, // Teclado con opción de salto de línea
                  textInputAction: TextInputAction.newline, // Acción del botón "Intro"
                  maxLines: null, // Permite infinitas líneas (crece automáticamente)
                  minLines: 3, // Altura inicial (3 líneas de altura)
                ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed:
                  (!esOpcionMultiple || _respuestaSeleccionada != null)
                      ? _verifyAnswer
                      : null,
              child: const Text("Verificar"),
            ),
            const SizedBox(height: 10),
            Text(_feedbackMessage, style: const TextStyle(fontSize: 16)),
          ],
        ),
      ),
    );
  }
}
