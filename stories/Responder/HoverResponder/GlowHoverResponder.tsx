import React from 'react'
import Glow, { GlowProps } from '../../Filter/Glow'
import { FitContent } from '../../_Styled'

const GlowHoverResponder: React.FC<Omit<GlowProps, "glow">> = (props) => {
  const {
    children,
    animated,
    blurRadius,
    intensity,
  } = props;
  const [glow, setGlow] = React.useState(false);
  
  return (
    <FitContent onMouseEnter={() => setGlow(true)} onMouseLeave={() => setGlow(false)}>
      <Glow
        glow={glow}
        intensity={intensity}
        blurRadius={blurRadius}
        animated={animated}>
        {children}
      </Glow>
    </FitContent>
  )
}

export default GlowHoverResponder
