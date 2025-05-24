import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'create_account_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  LoginScreenState createState() => LoginScreenState();
}

class LoginScreenState extends State<LoginScreen> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  Future<void> _login() async {
    final String email = emailController.text.trim();
    final String password = passwordController.text.trim();

    if (email.isEmpty || password.isEmpty) {
      _showSnackBar('Por favor, completa todos los campos.');
      return;
    }

    try {
      final response = await http.get(
        Uri.parse('https://prokids-b0ri.onrender.com/api/users'),
      );

      if (response.statusCode == 200) {
        final List<dynamic> users = json.decode(response.body);

        final user = users.firstWhere((user) {
          final userEmail = user['correo']?.toString().trim();
          final userPassword = user['password']?.toString().trim() ?? '';

          return userEmail == email && userPassword == password;
        }, orElse: () => null);

        if (user != null) {
          _showSnackBar('Login exitoso');

          // 🔥 Guardar el ID del usuario autenticado en SharedPreferences
          SharedPreferences prefs = await SharedPreferences.getInstance();
          await prefs.setString(
            'userId',
            user['id'],
          ); // Guarda el ID del usuario

          Navigator.pushNamed(context, '/todo');
        } else {
          _showSnackBar('Correo o contraseña incorrectos');
        }
      } else {
        _showSnackBar(
          'Error al conectar con el servidor: ${response.statusCode}',
        );
      }
    } catch (e) {
      _showSnackBar('Error: $e');
    }
  }

  /// Extrae valores del JSON, considerando Firestore anidado o JSON normal
  String? _extractValue(Map<String, dynamic> user, String key) {
    if (user.containsKey('fields')) {
      // Caso de Firestore con datos anidados en "fields"
      return user['fields'][key]?['stringValue']?.toString();
    }
    // Caso de API con JSON directo
    return user[key]?.toString();
  }

  // Función para mostrar un SnackBar
  void _showSnackBar(String message) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.blue, Colors.purpleAccent],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Inicia sesión',
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 20),
                  _buildTextField(
                    emailController,
                    'Correo Electrónico',
                    Icons.email,
                  ),
                  _buildTextField(
                    passwordController,
                    'Contraseña',
                    Icons.lock,
                    isPassword: true,
                  ),
                  const SizedBox(height: 30),
                  ElevatedButton(
                    onPressed: _login,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.blue,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 40,
                        vertical: 12,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 10,
                    ),
                    child: const Text(
                      'INGRESAR',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const CreateAccountScreen(),
                        ),
                      );
                    },
                    child: Text.rich(
                      TextSpan(
                        children: [
                          const TextSpan(
                            text: '¿No tienes cuenta? ',
                            style: TextStyle(color: Colors.white),
                          ),
                          TextSpan(
                            text: 'Crear una',
                            style: TextStyle(
                              color: Colors.white,
                              decoration: TextDecoration.underline,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(
    TextEditingController controller,
    String label,
    IconData icon, {
    bool isPassword = false,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: TextField(
        controller: controller,
        obscureText: isPassword,
        keyboardType: TextInputType.emailAddress,
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          labelText: label,
          labelStyle: const TextStyle(color: Colors.white70),
          prefixIcon: Icon(icon, color: Colors.white),
          filled: true,
          fillColor: Colors.white24,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
        ),
      ),
    );
  }
}
