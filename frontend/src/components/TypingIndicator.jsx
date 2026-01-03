import React from 'react';
import { Box, Stack } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// 1. Definição da animação de pulsação usando o utilitário do MUI
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(0.8);
  }
`;

// 2. Componente estilizado para o ponto individual
const Dot = styled(Box)(({ theme, color, size }) => ({
  width: size || 12,
  height: size || 12,
  backgroundColor: color || theme.palette.secondary.main,
  borderRadius: '50%',
  display: 'inline-block',
  animation: `${pulse} 1.5s ease-in-out infinite`,
  '&:nth-of-type(2)': {
    animationDelay: '0.2s',
  },
  '&:nth-of-type(3)': {
    animationDelay: '0.4s',
  },
}));

/**
 * Componente TypingIndicator
 * @param {string} color - Cor do loader (padrão: secondary.main)
 * @param {number|string} size - Tamanho dos pontos
 * @param {number|string} spacing - Espaçamento entre os pontos
 */
const TypingIndicator = ({ color, size, spacing = 1 }) => (
  <Stack direction="row" spacing={spacing} alignItems="center" justifyContent="center">
    <Dot color={color} size={size} />
    <Dot color={color} size={size} />
    <Dot color={color} size={size} />
  </Stack>
);

export default TypingIndicator;
