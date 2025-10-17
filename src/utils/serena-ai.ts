/**
 * Módulo de IA: Serena
 * Chatbot emocional básico con respuestas empáticas
 */

export interface SerenaResponse {
  message: string;
  emotion?: string;
}

export class SerenaAI {
  private static responses = {
    greeting: [
      '¡Hola! Soy Serena 🌸 ¿Cómo te sientes hoy?',
      'Hola, es un placer verte de nuevo 💜',
      '¡Bienvenido! Estoy aquí para escucharte 🌟',
    ],
    happy: [
      '¡Me encanta verte tan feliz! 😊 Comparte conmigo qué te hace sentir así.',
      'Tu alegría es contagiosa ✨ ¿Qué momento especial estás viviendo?',
      '¡Qué maravilloso! Celebremos juntos este momento 🎉',
    ],
    sad: [
      'Entiendo que estés pasando por un momento difícil 💙 Estoy aquí para ti.',
      'Está bien sentirse triste a veces. ¿Quieres hablar sobre lo que sientes?',
      'Tus emociones son válidas. Recuerda que esto también pasará 🌈',
    ],
    anxious: [
      'Respiremos juntos. Inhala... exhala... 🌬️ Estás en un lugar seguro.',
      'La ansiedad puede ser abrumadora. ¿Qué te ayudaría a sentirte más tranquilo?',
      'Recuerda: este momento pasará. Estás siendo muy valiente 💪',
    ],
    angry: [
      'Veo que estás molesto. Es válido sentir enojo. ¿Qué lo provocó?',
      'El enojo es una emoción natural. Hablemos sobre lo que te molesta 🔥',
      'Está bien estar enojado. Juntos encontraremos una forma de procesarlo.',
    ],
    calm: [
      'Qué hermosa sensación de calma ☮️ Disfruta este momento de paz.',
      'La tranquilidad es un regalo. ¿Qué te ayudó a encontrar esta calma?',
      'Me alegra verte en paz 🧘‍♀️ Cuéntame más sobre tu día.',
    ],
    confused: [
      'La confusión es el primer paso hacia la claridad 🤔 Hablemos sobre ello.',
      'Está bien no tener todas las respuestas. ¿En qué puedo ayudarte?',
      'Tomemos un momento para ordenar tus pensamientos juntos 💭',
    ],
    default: [
      'Gracias por compartir conmigo. ¿Hay algo más que quieras contarme?',
      'Estoy aquí para escucharte siempre que lo necesites 💜',
      'Tus sentimientos importan. Cuéntame más sobre lo que piensas.',
    ],
    motivation: [
      'Eres más fuerte de lo que crees 💪',
      'Cada día es una nueva oportunidad para crecer 🌱',
      'Recuerda ser gentil contigo mismo/a 🌸',
      'Tus esfuerzos valen la pena, sigue adelante ✨',
      'Mereces amor y cuidado, especialmente de ti mismo/a 💜',
    ],
    selfcare: [
      '¿Has tomado agua hoy? La hidratación es importante 💧',
      'Recuerda tomarte un descanso. Tu bienestar es prioridad ☕',
      '¿Qué tal una pausa para respirar profundamente? 🌬️',
      'Un pequeño paseo puede hacer maravillas por tu ánimo 🚶',
      'No olvides comer algo nutritivo hoy 🥗',
    ],
  };

  static getGreeting(): string {
    return this.getRandomResponse(this.responses.greeting);
  }

  static getMotivationalQuote(): string {
    return this.getRandomResponse(this.responses.motivation);
  }

  static getSelfCareReminder(): string {
    return this.getRandomResponse(this.responses.selfcare);
  }

  /**
   * Genera una frase personalizada basada en el estado de ánimo del usuario
   */
  static getPersonalizedPhrase(emotion: string): string {
    const emotionLower = emotion.toLowerCase();
    
    const phrases = {
      feliz: [
        'Tu alegría ilumina el día ✨ Sigue brillando',
        'La felicidad se refleja en todo lo que haces 🌟',
        'Qué hermoso verte tan radiante hoy 😊',
        'Tu sonrisa es tu mejor accesorio 💫',
      ],
      triste: [
        'Las tormentas pasan, el sol siempre vuelve 🌤️',
        'Está bien no estar bien. Mañana será un nuevo día 💙',
        'Tu fuerza está en aceptar cómo te sientes 🌊',
        'Recuerda: esto también pasará, eres más fuerte de lo que crees 💪',
      ],
      neutral: [
        'La calma también es valiosa, disfruta este momento ☁️',
        'En la neutralidad encuentras claridad 🧘',
        'No todos los días son extraordinarios, y está bien 🌿',
        'A veces, simplemente estar es suficiente 🍃',
      ],
      enamorado: [
        'El amor te hace brillar de forma especial 💕',
        'Qué hermoso sentir mariposas en el estómago 🦋',
        'El amor es el motor más poderoso del universo ❤️',
        'Disfruta cada momento de este hermoso sentimiento 💖',
      ],
      ansioso: [
        'Respira hondo. Estás a salvo en este momento 🌬️',
        'Un paso a la vez. Tú puedes con esto 🦋',
        'La ansiedad miente. Tú eres capaz y valiente 💪',
        'Ancla tu mente al presente. Aquí y ahora estás bien 🧘',
      ],
      enojado: [
        'El enojo es energía. Canalízala de forma constructiva ⚡',
        'Respira. Tu paz mental vale más que cualquier discusión 🌊',
        'Está bien sentir enojo, pero no dejes que te controle 🔥',
        'Tras la tormenta, siempre viene la calma 🌈',
      ],
    };

    // Mapeo de emociones
    if (emotionLower.includes('feliz') || emotionLower.includes('alegre') || emotionLower.includes('contento')) {
      return this.getRandomResponse(phrases.feliz);
    } else if (emotionLower.includes('triste') || emotionLower.includes('deprimido')) {
      return this.getRandomResponse(phrases.triste);
    } else if (emotionLower.includes('neutral') || emotionLower.includes('normal')) {
      return this.getRandomResponse(phrases.neutral);
    } else if (emotionLower.includes('enamorado') || emotionLower.includes('amor')) {
      return this.getRandomResponse(phrases.enamorado);
    } else if (emotionLower.includes('ansioso') || emotionLower.includes('nervioso') || emotionLower.includes('preocupado')) {
      return this.getRandomResponse(phrases.ansioso);
    } else if (emotionLower.includes('enojado') || emotionLower.includes('molesto') || emotionLower.includes('frustrado')) {
      return this.getRandomResponse(phrases.enojado);
    }

    // Frase por defecto
    return this.getRandomResponse([
      'Cada emoción es válida y te ayuda a crecer 🌱',
      'Honrar tus sentimientos es un acto de amor propio 💜',
      'Gracias por compartir tu día conmigo 🌸',
      'Tus emociones son tu brújula interior 🧭',
    ]);
  }

  static respondToEmotion(emotion: string): SerenaResponse {
    const emotionLower = emotion.toLowerCase();
    let responseArray = this.responses.default;

    if (emotionLower.includes('feliz') || emotionLower.includes('alegre') || emotionLower.includes('contento')) {
      responseArray = this.responses.happy;
    } else if (emotionLower.includes('triste') || emotionLower.includes('deprimido')) {
      responseArray = this.responses.sad;
    } else if (emotionLower.includes('ansioso') || emotionLower.includes('nervioso') || emotionLower.includes('preocupado')) {
      responseArray = this.responses.anxious;
    } else if (emotionLower.includes('enojado') || emotionLower.includes('molesto') || emotionLower.includes('frustrado')) {
      responseArray = this.responses.angry;
    } else if (emotionLower.includes('tranquilo') || emotionLower.includes('relajado') || emotionLower.includes('sereno')) {
      responseArray = this.responses.calm;
    } else if (emotionLower.includes('confundido') || emotionLower.includes('perdido')) {
      responseArray = this.responses.confused;
    }

    return {
      message: this.getRandomResponse(responseArray),
      emotion: emotion,
    };
  }

  static respondToMessage(message: string): SerenaResponse {
    const messageLower = message.toLowerCase();

    // Saludos
    if (messageLower.includes('hola') || messageLower.includes('buenos') || messageLower.includes('hey')) {
      return { message: this.getGreeting() };
    }

    // Agradecimientos
    if (messageLower.includes('gracias')) {
      return { message: '¡De nada! Siempre estaré aquí para ti 💜' };
    }

    // Despedidas
    if (messageLower.includes('adiós') || messageLower.includes('chao') || messageLower.includes('hasta luego')) {
      return { message: 'Hasta pronto. Cuídate mucho 🌸' };
    }

    // Ayuda/motivación
    if (messageLower.includes('ayuda') || messageLower.includes('necesito') || messageLower.includes('difícil')) {
      return { message: 'Estoy aquí para apoyarte. Recuerda que eres valiente y capaz de superar esto 💪✨' };
    }

    // Autocuidado
    if (messageLower.includes('cansado') || messageLower.includes('agotado')) {
      return { message: this.getSelfCareReminder() };
    }

    // Detección de emociones en el mensaje
    const emotions = ['feliz', 'triste', 'ansioso', 'enojado', 'tranquilo', 'confundido'];
    for (const emotion of emotions) {
      if (messageLower.includes(emotion)) {
        return this.respondToEmotion(emotion);
      }
    }

    // Respuesta por defecto
    return {
      message: this.getRandomResponse([
        'Cuéntame más sobre eso. Estoy escuchando atentamente 👂',
        'Entiendo. ¿Cómo te hace sentir eso?',
        'Gracias por compartir. ¿Hay algo más en tu mente?',
        'Tus pensamientos son importantes. Sigue expresándote 💭',
        'Estoy aquí para ti. ¿Qué más quieres contarme?',
      ]),
    };
  }

  private static getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }
}
