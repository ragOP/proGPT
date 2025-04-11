import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Animated,
  StatusBar,
  ImageBackground,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';

const backgroundImage = require('./assets/bg.png');

type QuestionType = 'choice' | 'text';

interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options?: string[];
  keyType?: 'alphabet' | 'numeric';
}

const questions: Question[] = [
  {id: 1, text: "What's your Full Name?", type: 'text', keyType: 'alphabet'},
  {id: 2, text: "What's your Running Age?", type: 'text', keyType: 'alphabet'},
  {id: 3, text: "What's your zipcode?", type: 'text', keyType: 'numeric'},
  {id: 4, text: 'Are you on Medicare?', type: 'choice', options: ['Yes', 'No']},
  {
    id: 5,
    text: 'Do you have Insurance?',
    type: 'choice',
    options: ['Yes', 'No'],
  },
];

const Questionnaire: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [inputValue, setInputValue] = useState<string>('');
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentQuestion = questions[currentIndex];

  const slideInFromRight = () => {
    slideAnim.setValue(300);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleNext = (answer: string) => {
    if (currentIndex < questions.length - 1) {
      setAnswers(prev => ({
        ...prev,
        [questions[currentIndex].id]: answer,
      }));
      setCurrentIndex(prev => prev + 1);
      setInputValue('');
      slideInFromRight();
    } else {
      console.log('answers', answers);
    }
  };

  const handleTextSubmit = () => {
    if (inputValue.trim()) {
      handleNext(inputValue.trim());
    }
  };

  const progress = (currentIndex + 1) / questions.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ImageBackground source={require('./assets/bg.png')} // ← Is this path correct?
  style={styles.backgroundImage}
  resizeMode="cover"
>
        <BlurView
          style={styles.blurOverlay}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="#000"
        />
        <View style={styles.container}>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, {width: `${progress * 100}%`}]} />
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.inner}>
            <Animated.View style={{transform: [{translateX: slideAnim}]}}>
              <Text style={styles.questionText}>{currentQuestion.text}</Text>
              <Text style={styles.subText}>
                This helps us personalize your experience
              </Text>

              {currentQuestion.type === 'choice' ? (
                currentQuestion.options?.map((opt, idx) => (
                  <Pressable
                    key={idx}
                    style={styles.optionButton}
                    onPress={() => handleNext(opt)}>
                    <Text style={styles.optionText}>{opt}</Text>
                  </Pressable>
                ))
              ) : (
                <TextInput
                  style={styles.input}
                  keyboardType={
                    currentQuestion.keyType === 'numeric'
                      ? 'numeric'
                      : 'default'
                  }
                  placeholder="Type here..."
                  placeholderTextColor="#aaa"
                  returnKeyType="done"
                  onSubmitEditing={handleTextSubmit}
                  value={inputValue}
                  onChangeText={text => setInputValue(text)}
                />
              )}
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Questionnaire;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    ...StyleSheet.absoluteFillObject,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingTop: 50,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 24,
    marginTop: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#facc15',
  },
  inner: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 60,
  },
  questionText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subText: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: '#1f1f1f',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
  },
  input: {
    backgroundColor: '#1f1f1f',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    fontSize: 18,
    color: '#fff',
  },
});
