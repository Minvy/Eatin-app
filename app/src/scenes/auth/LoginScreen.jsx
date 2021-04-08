import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, KeyboardAvoidingView} from 'react-native';
import { Input, Text, Button, Layout, Divider } from '@ui-kitten/components';
import Firebase from '@/utils/firebase'
import { useDispatch } from 'react-redux'
import { login } from '@/store/actions/auth'

const LoginScreen = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hideTitle, setHideTitle] = useState(false);

  const dispatch = useDispatch()

  const handleLogin = () => {
    dispatch(login(email, password));
  }

  const LoginAdmin = () => {
    dispatch(login('admin@admin.com', '123456'));

  }

  const LoginUser = () => {
    dispatch(login('TestE@gmail.com', 'Test123'));
  }

  const handleResetPassword = () => {
    props.navigation.navigate('Reset Password')
  }

  const Title = () => {
    if (hideTitle) {
      return <></>
    }
    return (<Text style={styles.titleText} category='h4'>Login</Text>);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <KeyboardAvoidingView style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Title />

          {/* {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
           {this.state.errorMessage}
           </Text>} */}

          <Input
            // textStyle={{ ... }}
            style={styles.textInput}
            value={email}
            onChangeText={email => setEmail(email)}
            label={evaProps => <Text {...evaProps}>Email</Text>}
          // caption={evaProps => <Text {...evaProps}>Caption</Text>}
          />
          <Input
            // textStyle={{ ... }}
            style={styles.textInput}
            secureTextEntry
            onChangeText={password => setPassword(password)}
            value={password}
            label={evaProps => <Text {...evaProps}>Password</Text>}
          // caption={evaProps => <Text {...evaProps}>Caption</Text>}
          />
          <View style={styles.bottomBtn}>
            <Button style={styles.button} onPress={handleLogin}>
              Login
          </Button>
            <Button style={styles.button} onPress={() => props.navigation.navigate('Sign Up')}>
              Sign Up
          </Button>
          </View>
        </KeyboardAvoidingView>

        {/* <Button onPress={LoginAdmin}>
          Admin Login
        </Button>
        <Button onPress={LoginUser}>
          User Login
        </Button> */}

        <View style={styles.bottomLink}>
          <Text appearance='hint' style={{ marginBottom: 10 }} onPress={handleResetPassword}>Forgotten Password ?</Text>
          <Divider />
        </View>

      </Layout>
    </SafeAreaView>
  );

};


const styles = StyleSheet.create({
  container: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '70%',
  },
  textInput: {
    margin: 5,
    padding: 5,
  },
  button: {
    marginBottom: 5,
    minWidth: "92%",
    margin: 10,
    borderRadius: 100
  },
  bottomBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomLink: {
    flex: 1
  },
  titleText: {
    color: '#545454',
    fontWeight: 'bold',
    fontSize: 35,
  }
})

export default LoginScreen;
