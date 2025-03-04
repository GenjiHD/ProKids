import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

class ToDoScreen extends StatefulWidget {
  const ToDoScreen({super.key});

  @override
  _ToDoScreenState createState() => _ToDoScreenState();
}

class _ToDoScreenState extends State<ToDoScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacity;
  late Animation<Offset> _slide;
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 700));
    _opacity = Tween<double>(begin: 0, end: 1).animate(_controller);
    _slide = Tween<Offset>(begin: const Offset(0, 0.2), end: Offset.zero)
        .animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));
    
    SchedulerBinding.instance.addPostFrameCallback((_) {
      _controller.forward();
    });
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  void _confirmLogout() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text("Confirmar"),
          content: const Text("¿Estás seguro de que quieres cerrar sesión?"),
          actions: <Widget>[
            TextButton(
              child: const Text("Cancelar"),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text("Cerrar sesión"),
              onPressed: () {
                Navigator.of(context).pop();
                Navigator.pushReplacementNamed(context, '/login');
              },
            ),
          ],
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
        title: const Text("ProKids", style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: BoxDecoration(color: Colors.blue.shade800),
              child: const Text("Menú", style: TextStyle(color: Colors.white, fontSize: 24)),
            ),
            ListTile(
              leading: const Icon(Icons.exit_to_app, color: Colors.red),
              title: const Text("Cerrar sesión"),
              onTap: _confirmLogout,
            ),
          ],
        ),
      ),
      body: FadeTransition(
        opacity: _opacity,
        child: SlideTransition(
          position: _slide,
          child: Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text("¡Bienvenido a ProKids!",
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.black87)),
                  const SizedBox(height: 20),
                  Image.asset('assets/dinosaurio.png', width: 150),
                ],
              ),
            ),
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: const Color.fromRGBO(21, 101, 192, 1),
        selectedItemColor: const Color.fromRGBO(21, 101, 192, 1),
        unselectedItemColor: const Color.fromRGBO(21, 101, 192, 1),
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: "Inicio"),
          BottomNavigationBarItem(icon: Icon(Icons.flag), label: "Misiones"),
          BottomNavigationBarItem(icon: Icon(Icons.bookmark), label: "Marcadores"),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: "Perfil"),
        ],
      ),
    );
  }
}
