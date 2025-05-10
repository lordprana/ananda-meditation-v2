import { Animated } from 'react-native'
import { useEffect, useRef } from 'react'

const FadeView = ({ children, hidden, style, ...rest }) => {
  const opacity = useRef(new Animated.Value(hidden ? 0 : 1))

  useEffect(() => {
    Animated.timing(opacity.current, {
      toValue: hidden ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [hidden])
  return (
    <Animated.View
      style={[style, { opacity: opacity.current }]}
      {...rest}
    >
      {children}
    </Animated.View>
  )
}

export default FadeView
