import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ActivityDetailScreen extends StatefulWidget {
  final Map<String, dynamic> activity;

  const ActivityDetailScreen({super.key, required this.activity});

  @override
  _ActivityDetailScreenState createState() => _ActivityDetailScreenState();
}

class _ActivityDetailScreenState extends State<ActivityDetailScreen> {
  final TextEditingController _answerController = TextEditingController();
  String _feedbackMessage = "";
  String? userId; // ID del usuario autenticado

  @override
  void initState() {
    super.initState();
    _loadUserId(); // Cargar el ID del usuario al iniciar la pantalla
  }

  /// 🔥 Cargar el ID del usuario autenticado desde SharedPreferences
  Future<void> _loadUserId() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      userId = prefs.getString('userId');
    });
  }

  /// 🔥 Función para verificar la respuesta
  Future<void> _verifyAnswer() async {
    String correctAnswer = widget.activity["RespuestaCorrecta"] ?? "";
    String userAnswer = _answerController.text.trim();

    bool esCorrecto = userAnswer == correctAnswer;
    setState(() {
      _feedbackMessage =
          esCorrecto ? "✅ ¡Correcto!" : "❌ Incorrecto, intenta de nuevo.";
    });

    if (userId != null) {
      await _guardarRespuesta(userAnswer);
    }
  }

  /// 🔥 Guarda la respuesta del usuario en Firestore
  Future<void> _guardarRespuesta(String respuesta) async {
    FirebaseFirestore firestore = FirebaseFirestore.instance;
    DocumentReference docRef = firestore
        .collection("Ejercicios")
        .doc(widget.activity["id"]);

    await docRef.update({
      "Respuestas": FieldValue.arrayUnion([
        {"UsuarioId": userId, "Respuesta": respuesta},
      ]),
    });
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
            const Text(
              "Código base:",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            Container(
              padding: const EdgeInsets.all(10),
              color: Colors.grey.shade200,
              child: const Text(
                "public class Main {\n"
                "  public static void main(String[] args) {\n"
                "    // Escribe aquí tu código\n"
                "  }\n"
                "}",
                style: TextStyle(fontFamily: "monospace"),
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _answerController,
              decoration: const InputDecoration(labelText: "Tu respuesta aquí"),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _verifyAnswer,
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
