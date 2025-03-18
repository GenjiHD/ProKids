import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'activity_detail_screen.dart'; // Asegúrate de importar la pantalla de detalle

class ToDoScreen extends StatefulWidget {
  const ToDoScreen({super.key});

  @override
  _ToDoScreenState createState() => _ToDoScreenState();
}

class _ToDoScreenState extends State<ToDoScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacity;
  late Animation<Offset> _slide;
  int _selectedIndex = 0;
  List<dynamic> _activities = []; // Lista de actividades
  String? userId; // ID del usuario autenticado

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
    _opacity = Tween<double>(begin: 0, end: 1).animate(_controller);
    _slide = Tween<Offset>(
      begin: const Offset(0, 0.2),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));

    SchedulerBinding.instance.addPostFrameCallback((_) {
      _controller.forward();
    });

    _loadUserId(); // 🔥 Cargar el ID del usuario autenticado
  }

  /// 🔥 Cargar el ID del usuario autenticado desde SharedPreferences
  Future<void> _loadUserId() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      userId = prefs.getString('userId');
    });
  }

  /// 🔥 Obtener actividades de la API
  Future<void> _fetchActivities() async {
    try {
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/activities'),
      );

      if (response.statusCode == 200) {
        final List<dynamic> activities = json.decode(response.body);
        setState(() {
          _activities = activities;
        });
      } else {
        _showSnackBar('Error al obtener actividades: ${response.statusCode}');
      }
    } catch (e) {
      _showSnackBar('Error de conexión: $e');
    }
  }

  /// 🔥 Verifica si el usuario ya respondió el ejercicio
  bool _verificarSiYaRespondio(Map<String, dynamic> activity) {
    if (userId == null)
      return false; // Si no hay usuario, no puede haber respuestas
    List<dynamic> respuestas = activity['Respuestas'] ?? [];
    return respuestas.any((respuesta) => respuesta['UsuarioId'] == userId);
  }

  /// 🔹 Navegar a la pantalla de detalle si el usuario no ha contestado
  void _navigateToActivityDetail(Map<String, dynamic> activity) {
    bool yaRespondido = _verificarSiYaRespondio(activity);

    if (!yaRespondido) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => ActivityDetailScreen(activity: activity),
        ),
      );
    }
  }

  /// 🔹 Construye la lista de actividades y muestra si han sido respondidas
  Widget _buildActivitiesList() {
    if (_activities.isEmpty) {
      return const Center(
        child: Text(
          "No hay actividades disponibles",
          style: TextStyle(fontSize: 18),
        ),
      );
    }

    return ListView.builder(
      itemCount: _activities.length,
      itemBuilder: (context, index) {
        final activity = _activities[index];
        bool yaRespondido = _verificarSiYaRespondio(activity);

        return GestureDetector(
          onTap: () => _navigateToActivityDetail(activity),
          child: Card(
            margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            elevation: 4,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: ListTile(
              leading: Icon(
                activity['TipoActividad'] == "Escritura"
                    ? Icons.edit
                    : Icons.checklist,
                color: Colors.blue.shade800,
                size: 30,
              ),
              title: Text(
                activity['Nombre'] ?? 'Sin nombre',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Text(yaRespondido ? "✅ Contestado" : "❗ No contestado"),
              tileColor: yaRespondido ? Colors.green.shade100 : Colors.white,
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blue.shade50,
      appBar: AppBar(
        backgroundColor: Colors.blue.shade800,
        title: const Text(
          "Ejercicios",
          style: TextStyle(
            color: Colors.white,
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: FadeTransition(
        opacity: _opacity,
        child: SlideTransition(
          position: _slide,
          child:
              _selectedIndex == 1
                  ? _buildActivitiesList()
                  : const Center(child: Text("Bienvenido a ProKids")),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: const Color.fromRGBO(21, 101, 192, 1),
        selectedItemColor: Colors.white,
        unselectedItemColor: Colors.white70,
        currentIndex: _selectedIndex,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });

          if (index == 1) {
            _fetchActivities();
          }
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: "Inicio"),
          BottomNavigationBarItem(icon: Icon(Icons.flag), label: "Misiones"),
        ],
      ),
    );
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));
  }
}
