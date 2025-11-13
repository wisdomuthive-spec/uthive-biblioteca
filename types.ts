export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // Apenas para simulação de autenticação
  role: 'student' | 'teacher' | 'admin';
  institution: string;
  teacherId?: number; // ID do professor, aplicável apenas para alunos
}

export interface Resource {
  id: number;
  type: 'book' | 'video' | 'audio' | 'audiobook';
  titulo: string;
  autor: string;
  sinopse: string;
  capaUrl: string;
  category: string;
  borrowedBy: number | null; // ID do aluno que emprestou ou nulo
  content?: string; // Conteúdo do livro para leitura
  audioUrl?: string; // URL para áudio (livro ou áudio independente)
  videoUrl?: string; // URL para vídeo
}

// Tipos para os relatórios do administrador
export interface ReadingActivity {
  day: string;
  booksRead: number;
}

export interface StudentActivity {
  studentName: string;
  timeSpentMinutes: number;
}

// Novo tipo para monitoramento de atividade do aluno
export interface ActivityLog {
  id: number;
  studentId: number;
  resourceId: number;
  startTime: number; // timestamp
  endTime: number | null; // timestamp or null if in progress
  durationSeconds: number;
  progress: number; // 0-100
  status: 'in-progress' | 'completed';
}