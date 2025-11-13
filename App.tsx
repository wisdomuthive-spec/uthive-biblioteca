import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ResourceList } from './components/BookList';
import { AddResourceModal } from './components/AddBookModal';
import { Auth } from './components/Auth';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ResourceView } from './components/ReadingView';
import type { Resource, User, ReadingActivity, StudentActivity, ActivityLog } from './types';

// Placeholder content for books
const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam. Proin sed quam quis விலங்கு magna varius pulvinar. Nullam sapien sem, ornare ac, nonummy non, lobortis a, enim.";

const mockUsers: User[] = [
    { id: 0, name: 'Admin Geral', email: 'admin@escola.com', password: '123', role: 'admin', institution: 'Escola Modelo' },
    { id: 1, name: 'Prof. Ana Silva', email: 'ana@escola.com', password: '123', role: 'teacher', institution: 'Escola Modelo' },
    { id: 2, name: 'Prof. Carlos Lima', email: 'carlos@escola.com', password: '123', role: 'teacher', institution: 'Escola Modelo' },
    { id: 101, name: 'João Pereira', email: 'joao@aluno.com', password: '123', role: 'student', institution: 'Escola Modelo', teacherId: 1 },
    { id: 102, name: 'Maria Costa', email: 'maria@aluno.com', password: '123', role: 'student', institution: 'Escola Modelo', teacherId: 1 },
    { id: 103, name: 'Pedro Alves', email: 'pedro@aluno.com', password: '123', role: 'student', institution: 'Escola Modelo', teacherId: 2 },
];
const mockResources: Resource[] = [
    { id: 1, type: 'audiobook', titulo: "O Guia do Mochileiro das Galáxias", autor: "Douglas Adams", sinopse: "A saga de Arthur Dent após a destruição da Terra.", capaUrl: "https://picsum.photos/seed/mochileiro/300/400", borrowedBy: 101, content: loremIpsum, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", category: "Ficção Científica" },
    { id: 2, type: 'book', titulo: "A Revolução dos Bichos", autor: "George Orwell", sinopse: "Uma sátira sobre a Revolução Russa em uma fazenda.", capaUrl: "https://picsum.photos/seed/revolucao/300/400", borrowedBy: null, content: loremIpsum, category: "Ficção" },
    { id: 3, type: 'book', titulo: "Duna", autor: "Frank Herbert", sinopse: "Casas nobres lutam pelo controle do planeta deserto Arrakis.", capaUrl: "https://picsum.photos/seed/duna/300/400", borrowedBy: 103, content: loremIpsum, category: "Ficção Científica" },
    { id: 4, type: 'video', titulo: "Documentário: Cosmos", autor: "Carl Sagan", sinopse: "Uma viagem pelo universo e pela história da ciência.", capaUrl: "https://picsum.photos/seed/cosmos/300/400", borrowedBy: null, videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", category: "Ciência" },
    { id: 5, type: 'audio', titulo: "Palestra: O Poder do Hábito", autor: "Charles Duhigg", sinopse: "Uma análise sobre como os hábitos são formados.", capaUrl: "https://picsum.photos/seed/habito/300/400", borrowedBy: null, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", category: "Não-Ficção" },
    { id: 6, type: 'audiobook', titulo: "Harry Potter e a Pedra Filosofal", autor: "J.K. Rowling", sinopse: "O início das aventuras do jovem bruxo Harry Potter.", capaUrl: "https://picsum.photos/seed/potter/300/400", borrowedBy: null, content: loremIpsum, audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", category: "Fantasia" },
];
const mockActivityLogs: ActivityLog[] = [
    { id: 1, studentId: 101, resourceId: 1, startTime: Date.now() - 2 * 24 * 60 * 60 * 1000, endTime: Date.now() - 2 * 24 * 60 * 60 * 1000 + 1234000, durationSeconds: 1234, progress: 85, status: 'completed' },
    { id: 2, studentId: 103, resourceId: 3, startTime: Date.now() - 1 * 24 * 60 * 60 * 1000, endTime: Date.now() - 1 * 24 * 60 * 60 * 1000 + 567000, durationSeconds: 567, progress: 40, status: 'in-progress' },
];

const mockInstitutions: string[] = [ 'Escola Modelo', 'Colégio Alpha', 'Instituto Beta' ];
const mockReadingActivity: ReadingActivity[] = [ { day: 'Seg', booksRead: 5 }, { day: 'Ter', booksRead: 8 }, { day: 'Qua', booksRead: 12 }, { day: 'Qui', booksRead: 7 }, { day: 'Sex', booksRead: 15 }, { day: 'Sáb', booksRead: 10 }, { day: 'Dom', booksRead: 6 }, ];
const mockStudentActivity: StudentActivity[] = [ { studentName: 'João Pereira', timeSpentMinutes: 240 }, { studentName: 'Maria Costa', timeSpentMinutes: 180 }, { studentName: 'Pedro Alves', timeSpentMinutes: 320 }, ];

type View = 'library' | 'my-resources' | 'reading' | 'admin-dashboard';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockActivityLogs);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<View>('library');
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  const [activeLog, setActiveLog] = useState<ActivityLog | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const handleLogin = (email: string, pass: string) => {
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      setCurrentUser(user);
      setView(user.role === 'admin' ? 'admin-dashboard' : 'library');
    } else { alert('Credenciais inválidas!'); }
  };

  const handleRegister = (newUser: Omit<User, 'id'>) => {
    if (users.some(u => u.email === newUser.email)) {
      alert('Este e-mail já está em uso.');
      return;
    }
    const userWithId = { ...newUser, id: Date.now() };
    setUsers([...users, userWithId]);
    setCurrentUser(userWithId);
    setView('library');
  };

  const handleLogout = () => {
    if(activeLog) handleEndActivity();
    setCurrentUser(null);
    setView('library');
  };
  
  const handleStartActivity = (resource: Resource) => {
    if (currentUser?.role !== 'student') return;
    const newLog: ActivityLog = {
      id: Date.now(),
      studentId: currentUser.id,
      resourceId: resource.id,
      startTime: Date.now(),
      endTime: null,
      durationSeconds: 0,
      progress: 0,
      status: 'in-progress',
    };
    setActivityLogs([...activityLogs, newLog]);
    setActiveLog(newLog);
    setActiveResource(resource);
    setView('reading');
  }

  const handleUpdateActivity = (progress: number, duration: number) => {
    if(!activeLog) return;
    const updatedLog = { ...activeLog, progress, durationSeconds: Math.round(duration) };
    setActiveLog(updatedLog); // Update active log locally for performance
    // Debounce this in a real app
    setActivityLogs(prev => prev.map(l => l.id === activeLog.id ? updatedLog : l));
  }

  const handleEndActivity = () => {
    if(!activeLog) return;
    // Fix: Explicitly type `finalLog` to satisfy the `ActivityLog` type, specifically for the 'status' property.
    const finalLog: ActivityLog = { 
        ...activeLog, 
        endTime: Date.now(),
        status: activeLog.progress >= 95 ? 'completed' : 'in-progress'
    };
    setActivityLogs(prev => prev.map(l => l.id === activeLog.id ? finalLog : l));
    setActiveLog(null);
  }

  const handleBorrowResource = (resourceId: number) => {
    if (currentUser?.role !== 'student') return;
    const resourceToBorrow = resources.find(b => b.id === resourceId);
    if (!resourceToBorrow) return;

    setResources(resources.map(res =>
      res.id === resourceId ? { ...res, borrowedBy: currentUser.id } : res
    ));
    
    handleStartActivity({ ...resourceToBorrow, borrowedBy: currentUser.id });
  };

  const handleReturnResource = (resourceId: number) => {
    setResources(resources.map(res =>
      (res.id === resourceId && res.borrowedBy === currentUser?.id)
        ? { ...res, borrowedBy: null }
        : res
    ));
  };

  const handleAddResource = (newResourceData: Omit<Resource, 'id' | 'borrowedBy'>) => {
    if (currentUser?.role !== 'teacher' && currentUser?.role !== 'admin') return;
    const newResource: Resource = {
      ...newResourceData,
      id: Date.now(),
      borrowedBy: null,
      ...(newResourceData.type === 'book' && { content: loremIpsum }),
    };
    setResources([newResource, ...resources]);
  };

  const teachers = useMemo(() => users.filter(u => u.role === 'teacher'), [users]);
  const categories = useMemo(() => ['Todos', ...Array.from(new Set(resources.map(r => r.category)))], [resources]);

  const resourcesToDisplay = useMemo(() => {
    if (view === 'my-resources' && currentUser?.role === 'student') {
      return resources.filter(res => res.borrowedBy === currentUser.id);
    }
    return resources;
  }, [resources, view, currentUser]);

  const handleBackToLibrary = () => {
    handleEndActivity();
    setActiveResource(null);
    setView('library');
  }

  const renderMainContent = () => {
    if (view === 'admin-dashboard' && currentUser?.role === 'admin') {
      return <AdminDashboard users={users} books={resources} readingActivity={mockReadingActivity} studentActivity={mockStudentActivity} />;
    }
    if (view === 'reading' && activeResource) {
      return <ResourceView resource={activeResource} onBack={handleBackToLibrary} onUpdateActivity={handleUpdateActivity} />;
    }
    if (currentUser?.role === 'teacher') {
      return <TeacherDashboard teacher={currentUser} allUsers={users} allResources={resources} allLogs={activityLogs} />;
    }
    return <ResourceList 
              resources={resourcesToDisplay} 
              currentUser={currentUser!} 
              onBorrow={handleBorrowResource} 
              onReturn={handleReturnResource} 
              onOpen={handleStartActivity} 
              isMyResources={view === 'my-resources'}
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />;
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} onRegister={handleRegister} institutions={mockInstitutions} teachers={teachers} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200">
      <Header 
        user={currentUser} 
        onAddResourceClick={() => setIsModalOpen(true)} 
        onLogout={handleLogout} 
        onNavigate={setView as any}
        currentView={view} 
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderMainContent()}
      </main>
      <AddResourceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddResource={handleAddResource} />
    </div>
  );
};

export default App;
