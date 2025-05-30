import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'activity_detail_screen.dart';

class ToDoScreen extends StatefulWidget {
  const ToDoScreen({super.key});

  @override
  _ToDoScreenState createState() => _ToDoScreenState();
}

// ... (imports y clase ToDoScreen sin cambios)

class _ToDoScreenState extends State<ToDoScreen>
    with SingleTickerProviderStateMixin {
  List<dynamic> _activities = [];
  String? userId;
  Set<String> _actividadesResueltas = {};
  int _selectedIndex = 1;

  late AnimationController _controller;
  late Animation<double> _opacity;
  late Animation<Offset> _slide;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );

    _opacity = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));

    _slide = Tween<Offset>(
      begin: const Offset(0.1, 0),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));

    _controller.forward();

    _initData();
  }

  Future<void> _initData() async {
    await _loadUserId();
    if (userId != null) {
      await _fetchUserProgress(userId!);
      await _fetchActivities();
    }
  }

  Future<void> _loadUserId() async {
    final prefs = await SharedPreferences.getInstance();
    final id = prefs.getString('userId');
    setState(() {
      userId = id;
    });
  }

  Future<void> _fetchUserProgress(String id) async {
    try {
      final response = await http.get(
        Uri.parse('https://prokids-b0ri.onrender.com/api/progreso-usuario/$id'),
      );

      if (response.statusCode == 200) {
        final List<dynamic> progreso = json.decode(response.body);
        final actividadesIds =
            progreso
                .map<String>((item) => item['ActividadID'].toString().trim())
                .toSet();

        setState(() {
          _actividadesResueltas = actividadesIds;
        });

        print('Actividades resueltas por usuario: $_actividadesResueltas');
      } else {
        _showSnackBar('Error al obtener progreso: ${response.statusCode}');
      }
    } catch (e) {
      _showSnackBar('Error de conexión: $e');
    }
  }

  Future<void> _fetchActivities() async {
    try {
      final response = await http.get(
        Uri.parse('https://prokids-b0ri.onrender.com/api/activities'),
      );

      if (response.statusCode == 200) {
        final List<dynamic> activities = json.decode(response.body);

        setState(() {
          _activities = activities;
        });

        print('Actividades totales: ${_activities.length}');
      } else {
        _showSnackBar('Error al obtener actividades: ${response.statusCode}');
      }
    } catch (e) {
      _showSnackBar('Error de conexión: $e');
    }
  }

  bool _verificarSiYaRespondio(Map<String, dynamic> activity) {
    final String idActividad = activity['id']?.toString().trim() ?? '';
    return _actividadesResueltas.contains(idActividad);
  }

  void _navigateToActivityDetail(Map<String, dynamic> activity) {
    final bool yaRespondida = _verificarSiYaRespondio(activity);
    if (!yaRespondida) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => ActivityDetailScreen(activity: activity),
        ),
      ).then((_) {
        if (userId != null) {
          _fetchUserProgress(userId!); // 👈 Aquí se actualiza el progreso
        }
      });
    }
  }

  String _getAppBarTitle() {
    switch (_selectedIndex) {
      case 0:
        return "Inicio";
      case 1:
        return "Ejercicios";
      case 2:
        return "Tutorial";
      default:
        return "ProKids";
    }
  }

  Widget _getCurrentScreen() {
    switch (_selectedIndex) {
      case 0:
        return _buildHomeScreen();
      case 1:
        return _buildActivitiesList();
      case 2:
        return _buildTutorialScreen();
      default:
        return _buildHomeScreen();
    }
  }

  Widget _buildHomeScreen() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.home, size: 60, color: Colors.blue),
          SizedBox(height: 20),
          Text(
            "Bienvenido a ProKids",
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 10),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 40),
            child: Text(
              "Selecciona una sección en el menú inferior",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActivitiesList() {
    if (_activities.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text("No hay actividades disponibles"),
            TextButton(
              onPressed: _fetchActivities,
              child: const Text("Recargar actividades"),
            ),
          ],
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

  Widget _buildTutorialScreen() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildTutorialSection(
            icon: Icons.home,
            title: "Inicio",
            description:
                "Pantalla principal con información básica de la aplicación.",
          ),
          _buildTutorialSection(
            icon: Icons.flag,
            title: "Ejercicios",
            description:
                "Contiene todas las actividades disponibles. Los iconos indican:\n"
                "✅ Actividad completada\n"
                "❗ Actividad pendiente",
          ),
          const SizedBox(height: 30),
          const Text(
            "Guía Rápida:",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Color.fromARGB(255, 35, 108, 191),
            ),
          ),
          const SizedBox(height: 15),
          _buildStepGuide("1", "Navega entre secciones con el menú inferior"),
          _buildStepGuide(
            "2",
            "En 'Ejercicios' encontrarás todas las actividades",
          ),
          _buildStepGuide("3", "Toca cualquier actividad para comenzar"),
          _buildStepGuide(
            "4",
            "Marca tus respuestas cuando completes un ejercicio",
          ),
        ],
      ),
    );
  }

  Widget _buildTutorialSection({
    required IconData icon,
    required String title,
    required String description,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 20),
      elevation: 3,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 40, color: Colors.blue.shade800),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(description, style: const TextStyle(fontSize: 14)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepGuide(String number, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(
              color: Colors.blue.shade800,
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                number,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(child: Text(text, style: const TextStyle(fontSize: 15))),
        ],
      ),
    );
  }

  BottomNavigationBar _buildBottomNavBar() {
    return BottomNavigationBar(
      backgroundColor: Colors.blue.shade800,
      selectedItemColor: Colors.white,
      unselectedItemColor: Colors.white70,
      currentIndex: _selectedIndex,
      onTap: (index) {
        if (index != _selectedIndex) {
          setState(() {
            _selectedIndex = index;
            _controller.reset();
            _controller.forward();
          });
        }
      },
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home), label: "Inicio"),
        BottomNavigationBarItem(icon: Icon(Icons.flag), label: "Ejercicios"),
        BottomNavigationBarItem(icon: Icon(Icons.school), label: "Tutorial"),
      ],
    );
  }

  void _showSnackBar(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blue.shade50,
      appBar: AppBar(
        backgroundColor: Colors.blue.shade800,
        title: Text(
          _getAppBarTitle(),
          style: const TextStyle(
            color: Colors.white,
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: FadeTransition(
        opacity: _opacity,
        child: SlideTransition(position: _slide, child: _getCurrentScreen()),
      ),
      bottomNavigationBar: _buildBottomNavBar(),
    );
  }
}
