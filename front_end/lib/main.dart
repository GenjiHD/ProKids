import 'package:flutter/material.dart';
import 'package:prueba/screens/create_account_screen.dart';
import 'package:prueba/screens/login_screen.dart';
import 'package:prueba/screens/to_do_screen.dart';
import 'screens/welcome_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();  // Aseguramos que el entorno Flutter esté listo.
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: '/', // Ruta inicial
      routes: {
        '/': (context) => SplashScreen(),  // La pantalla de carga es la inicial
        '/welcome': (context) => const WelcomeScreen(),  // Se dirige a la pantalla de bienvenida
        '/login': (context) => const LoginScreen(),
        '/todo': (context) => const ToDoScreen(),
        '/createAccount': (context) => const CreateAccountScreen(),
      },
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 4), () {
      // Después de la carga, redirigir a la pantalla de bienvenida
      Navigator.pushReplacementNamed(context, '/welcome');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0073e6),  // Azul fuerte de la app
      body: Center(
        child: Image.asset('assets/dinosaurio.png', width: 200, height: 200),  // Logo
      ),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Home")),
      body: const Center(child: Text("Bienvenido!")),
    );
  }
}
