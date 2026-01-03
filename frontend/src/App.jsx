import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Drawer,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Avatar,
  Fade,
  Container,
  Card,
  CardContent,
} from '@mui/material';
import TypingIndicator from './components/TypingIndicator';
import {
  Menu as MenuIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Upload as UploadIcon,
  Description as DescriptionIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { uploadDocument, askQuestion, getDocuments } from './services/api';

const drawerWidth = 320;

function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);

  // Load documents on mount
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const result = await uploadDocument(file);

      // Add to documents list
      setDocuments(prev => [result, ...prev]);
      setSelectedDocument(result);

      // Success message
      setMessages([{
        id: Date.now(),
        text: `✅ Documento "${result.file_name}" processado com sucesso! Agora você pode fazer perguntas sobre ele.`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

    } catch (err) {
      console.error('Upload failed:', err);
      // Error message
      setMessages([{
        id: Date.now(),
        text: '❌ Falha ao fazer upload do arquivo. Tente novamente.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const selectDocument = (doc) => {
    setSelectedDocument(doc);
    setMessages([]); // Clear messages when switching documents
  };

  const sendQuestion = async () => {
    if (!selectedDocument) {
      alert('Selecione um documento primeiro!');
      return;
    }
    if (!question.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: question,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    const currentQuestion = question;
    setQuestion('');

    try {
      const result = await askQuestion(selectedDocument.id, currentQuestion);

      const botMessage = {
        id: Date.now() + 1,
        text: result.answer,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

    } catch (err) {
      console.error('Question failed:', err);

      // Add error message to chat
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: '❌ Desculpe, houve um erro ao processar sua pergunta. Tente novamente.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendQuestion();
    }
  };

  const triggerUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="app-container">
      {/* App Bar */}
      <header className="app-bar">
        <div className="app-bar-cnt">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{ mr: 1, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          {selectedDocument ? (
            <>
              <DescriptionIcon className="app-bar-icon" />
              <Typography variant="h6" noWrap component="div" className="app-bar-title">
                {selectedDocument.file_name}
              </Typography>
            </>
          ) : (
            <Typography variant="h6" noWrap component="div" className="app-bar-title">
              IA de Documentos
            </Typography>
          )}
          <div className="app-bar-act">
            <div className="app-bar-sts">
              <div className="app-bar-dot"></div>
              Ativo
            </div>
            <IconButton color="inherit" size="small">
              <MoreVertIcon />
            </IconButton>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Drawer
        className="sidebar-drw"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'white',
            borderRight: 1,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        variant="persistent"
        anchor="left"
        open={sidebarOpen}
      >
        {/* Header da Sidebar */}
        <Box sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              py: 1.5,
              fontSize: '0.9rem',
              textTransform: 'none'
            }}
          >
            Novo Chat
          </Button>
        </Box>

        {/* Lista de Documentos */}
        <Box sx={{
          flex: 1,
          overflow: 'auto',
          p: 2
        }}>
          <Typography
            variant="overline"
            sx={{
              mb: 2,
              display: 'block',
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          >
            Arquivos Recentes
          </Typography>

          <List sx={{ py: 0 }}>
            {documents.map((doc) => (
              <ListItem key={doc.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={selectedDocument?.id === doc.id}
                  onClick={() => selectDocument(doc)}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    transition: 'all 0.2s',
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                      '&:hover': {
                        bgcolor: 'primary.light',
                      },
                    },
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                >
                  <ListItemIcon sx={{
                    minWidth: 40,
                    color: selectedDocument?.id === doc.id ? 'primary.main' : 'text.secondary'
                  }}>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: selectedDocument?.id === doc.id ? 600 : 500,
                          fontSize: '0.9rem',
                          lineHeight: 1.3
                        }}
                      >
                        {doc.file_name}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: '0.75rem',
                          color: 'text.secondary'
                        }}
                      >
                        Processado
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {documents.length === 0 && (
            <Box sx={{
              textAlign: 'center',
              py: 6,
              color: 'text.secondary',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <DescriptionIcon sx={{
                fontSize: 64,
                mb: 2,
                opacity: 0.4,
                color: 'grey.400'
              }} />
              <Typography variant="body2" sx={{ mb: 1 }}>
                Nenhum documento ainda
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Faça upload para começar
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          overflow: 'hidden',
          p: { xs: 0.5, md: 1 },
          transition: 'margin-left 0.3s ease',
          ml: { md: sidebarOpen ? `${drawerWidth}px` : 0 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            px: { xs: 0.5, md: 1 },
            maxWidth: '100%'
          }}
        >
          {/* Welcome Screen */}
          {!selectedDocument && messages.length === 0 ? (
            <Fade in={true} timeout={800}>
              <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                py: { xs: 2, md: 4 },
                px: 2,
              }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'primary.main',
                    mb: 3,
                    boxShadow: 2
                  }}
                >
                  <DescriptionIcon sx={{ fontSize: 32 }} />
                </Avatar>

                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, fontSize: '1.8rem' }}>
                  Análise Inteligente de Documentos
                </Typography>

                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, fontSize: '1rem' }}>
                  Faça upload de um PDF, DOCX ou imagem e faça perguntas específicas sobre o conteúdo usando IA.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, maxWidth: 600, mb: 4 }}>
                  <Card sx={{ flex: 1, '&:hover': { boxShadow: 4 }, transition: 'box-shadow 0.3s ease' }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Typography variant="subtitle1" gutterBottom color="primary" sx={{ fontSize: '1rem' }}>
                        📋 Resumos Rápidos
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                        "Resuma este contrato em 3 tópicos"
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card sx={{ flex: 1, '&:hover': { boxShadow: 4 }, transition: 'box-shadow 0.3s ease' }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Typography variant="subtitle1" gutterBottom color="primary" sx={{ fontSize: '1rem' }}>
                        🔍 Busca de Dados
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                        "Qual o faturamento mencionado?"
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={triggerUpload}
                  startIcon={<UploadIcon />}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    boxShadow: 2,
                    '&:hover': { boxShadow: 4 }
                  }}
                >
                  Selecionar Arquivo para Começar
                </Button>
              </Box>
            </Fade>
          ) : (
            <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Chat Area */}
              <div className="chat-cnt">
                <Paper
                  elevation={1}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    mb: 2,
                  }}
                >
                  <div className="chat-msgs">
                    {messages.map((msg) => (
                      <Box
                        key={msg.id}
                        sx={{
                          display: 'flex',
                          gap: 2,
                          alignItems: 'flex-start',
                          flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: msg.sender === 'user' ? 'primary.main' : 'secondary.main',
                            width: 40,
                            height: 40,
                          }}
                        >
                          {msg.sender === 'user' ? <PersonIcon /> : <BotIcon />}
                        </Avatar>

                        <Box sx={{ maxWidth: '70%', minWidth: 200 }}>
                          <Paper
                            elevation={1}
                            sx={{
                              p: 2,
                              borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                              bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                              color: msg.sender === 'user' ? 'white' : 'text.primary',
                            }}
                          >
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                              {msg.text}
                            </Typography>
                          </Paper>
                          <Typography
                            variant="caption"
                            sx={{
                              mt: 1,
                              color: 'text.secondary',
                              display: 'block',
                              textAlign: msg.sender === 'user' ? 'right' : 'left'
                            }}
                          >
                            {msg.timestamp}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                    {isTyping && (
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                          alignItems: 'flex-start',
                          flexDirection: 'row',
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: 'secondary.main',
                            width: 40,
                            height: 40,
                          }}
                        >
                          <BotIcon />
                        </Avatar>

                        <Box sx={{ maxWidth: '70%', minWidth: 200 }}>
                          <Paper
                            elevation={1}
                            sx={{
                              p: 2,
                              borderRadius: '20px 20px 20px 4px',
                              bgcolor: 'background.paper',
                              color: 'text.primary',
                            }}
                          >
                            <TypingIndicator size={12} spacing={0.8} />
                          </Paper>
                        </Box>
                      </Box>
                    )}
                  </div>
                </Paper>
              </div>

              {/* Input Area */}
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={selectedDocument ? "Faça uma pergunta sobre o documento..." : "Selecione um documento primeiro"}
                    disabled={!selectedDocument}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                  />

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />

                  <IconButton
                    onClick={triggerUpload}
                    sx={{
                      bgcolor: 'grey.100',
                      '&:hover': { bgcolor: 'grey.200' },
                      borderRadius: 2,
                    }}
                  >
                    <AttachFileIcon />
                  </IconButton>

                  <Button
                    variant="contained"
                    onClick={sendQuestion}
                    disabled={!question.trim() || !selectedDocument}
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    <SendIcon sx={{ mr: 1 }} />
                    Enviar
                  </Button>
                </Box>
              </Paper>
            </Box>
          )}
        </Container>
      </Box>
    </div>
  );
}

export default App;
