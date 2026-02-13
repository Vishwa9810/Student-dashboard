
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  UserCheck, 
  Calendar, 
  Briefcase, 
  BookOpen, 
  ExternalLink, 
  Plus, 
  Sparkles,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

import { 
  Task, 
  AttendanceRecord, 
  Exam, 
  Internship, 
  Note, 
  ViewType 
} from './types';
import { 
  EXTERNAL_LINKS, 
  MOCK_ATTENDANCE, 
  MOCK_TASKS, 
  MOCK_EXAMS, 
  MOCK_INTERNSHIPS 
} from './constants';
import { summarizeNote, getProductivityAdvice } from './services/geminiService';

const SidebarItem: React.FC<{ 
  id: ViewType; 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: (id: ViewType) => void 
}> = ({ id, icon, label, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [exams, setExams] = useState<Exam[]>(MOCK_EXAMS);
  const [internships, setInternships] = useState<Internship[]>(MOCK_INTERNSHIPS);
  const [notes, setNotes] = useState<Note[]>([
    { id: 'n1', title: 'Macro Policy Notes', content: 'Inflation is a general increase in prices and fall in the purchasing value of money. Central banks use interest rates to control inflation.', date: '2024-05-15' }
  ]);
  const [aiAdvice, setAiAdvice] = useState<string>('');

  useEffect(() => {
    const fetchAdvice = async () => {
      const advice = await getProductivityAdvice({ tasks, attendance });
      setAiAdvice(advice);
    };
    fetchAdvice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleSummarize = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    // Set loading indicator placeholder
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, summary: 'Summarizing with Gemini...' } : n));
    
    const summary = await summarizeNote(note.content);
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, summary } : n));
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back, Student!</h1>
          <p className="text-slate-500">Here is your daily snapshot.</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-center space-x-2">
          <Sparkles className="text-indigo-600 w-5 h-5" />
          <p className="text-sm font-medium text-indigo-700">{aiAdvice || "Loading AI insights..."}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-600" /> Upcoming Tasks
          </h3>
          <div className="space-y-3">
            {tasks.filter(t => !t.completed).slice(0, 3).map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium">{task.title}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  task.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" /> Attendance Status
          </h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendance}>
                <XAxis dataKey="courseName" hide />
                <Tooltip />
                <Bar dataKey="attended" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" /> Upcoming Exams
          </h3>
          <div className="space-y-4">
            {exams.map(exam => (
              <div key={exam.id} className="border-l-4 border-amber-400 pl-3">
                <p className="font-semibold text-sm">{exam.course}</p>
                <p className="text-xs text-slate-500">{new Date(exam.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-indigo-600 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Quick Links</h2>
          <p className="opacity-80">Access your core platforms in one click.</p>
        </div>
        <div className="flex gap-4">
          {EXTERNAL_LINKS.map(link => (
            <a 
              key={link.name} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-xl flex items-center gap-2 border border-white/20"
            >
              <span>{link.icon}</span>
              <span className="font-medium text-sm">{link.name}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Assignment Tracker</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 shadow-sm transition-all">
          <Plus className="w-4 h-4" /> New Task
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map(task => (
          <div key={task.id} className={`p-4 rounded-xl border bg-white transition-all ${task.completed ? 'opacity-60 grayscale' : 'hover:border-indigo-200 hover:shadow-md'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{task.course}</span>
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => toggleTask(task.id)}
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <h3 className={`font-semibold text-slate-800 ${task.completed ? 'line-through' : ''}`}>{task.title}</h3>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-slate-500">Due {task.dueDate}</span>
              <span className={`px-2 py-1 rounded-full ${
                task.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {task.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Attendance Monitoring</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Course Presence Details</h3>
          <div className="space-y-6">
            {attendance.map(item => {
              const percentage = (item.attended / item.total) * 100;
              const isWarning = percentage < 75;
              return (
                <div key={item.courseId} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{item.courseName}</span>
                    <span className={isWarning ? 'text-rose-600' : 'text-emerald-600'}>
                      {item.attended}/{item.total} sessions ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${isWarning ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  {isWarning && <p className="text-[10px] text-rose-500 font-medium italic">⚠️ Minimum attendance risk detected</p>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-4 self-start">Aggregate Performance</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendance}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="attended"
                  nameKey="courseName"
                >
                  {attendance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#ec4899'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-slate-500 mt-4 text-center">Your overall attendance health is good across major courses.</p>
        </div>
      </div>
    </div>
  );

  const renderInternships = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Internship Pipeline</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all">Add Opportunity</button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Company</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Applied</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {internships.map(intern => (
              <tr key={intern.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-700">{intern.company}</td>
                <td className="px-6 py-4 text-slate-600">{intern.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    intern.status === 'offer' ? 'bg-emerald-100 text-emerald-700' :
                    intern.status === 'interview' ? 'bg-amber-100 text-amber-700' :
                    intern.status === 'applied' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {intern.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">{intern.dateApplied}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderNotes = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Smart Lecture Notes</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all">New Note</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {notes.map(note => (
            <div key={note.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-slate-800">{note.title}</h3>
                <span className="text-xs text-slate-400">{note.date}</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{note.content}</p>
              <div className="pt-4 border-t flex gap-3">
                <button 
                  onClick={() => handleSummarize(note.id)}
                  className="flex items-center gap-2 text-indigo-600 font-semibold text-sm bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-all"
                >
                  <Sparkles className="w-4 h-4" /> Gemini Summarize
                </button>
              </div>
              {note.summary && (
                <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <h4 className="text-xs font-bold text-indigo-700 mb-2 uppercase tracking-widest">AI Summary</h4>
                  <div className="text-sm text-slate-700 whitespace-pre-wrap">{note.summary}</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold">Study Mode</h3>
          <p className="text-slate-400 max-w-xs">AI-driven summarization helps reduce cognitive overload. Take your notes, and we will do the rest.</p>
          <div className="pt-4 grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="bg-white/5 p-4 rounded-xl">
              <span className="block text-2xl font-bold">12</span>
              <span className="text-xs text-slate-500 uppercase">Notes Saved</span>
            </div>
            <div className="bg-white/5 p-4 rounded-xl">
              <span className="block text-2xl font-bold">3</span>
              <span className="text-xs text-slate-500 uppercase">Summarized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return renderDashboard();
      case 'assignments': return renderAssignments();
      case 'attendance': return renderAttendance();
      case 'exams': return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Exam Schedule</h2>
          <div className="grid gap-4">
            {exams.map(exam => (
              <div key={exam.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-amber-50 rounded-2xl flex flex-col items-center justify-center text-amber-600 font-bold">
                    <span className="text-xs uppercase">Jun</span>
                    <span className="text-2xl">15</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{exam.course}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1">📍 {exam.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase">Days Left</span>
                  <p className="text-3xl font-bold text-slate-800">28</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'internships': return renderInternships();
      case 'notes': return renderNotes();
      default: return renderDashboard();
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transform lg:translate-x-0 transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">StudentOS</h1>
          </div>

          <nav className="space-y-2">
            <SidebarItem id="dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeView === 'dashboard'} onClick={setActiveView} />
            <SidebarItem id="assignments" icon={<CheckSquare size={20} />} label="Assignments" active={activeView === 'assignments'} onClick={setActiveView} />
            <SidebarItem id="attendance" icon={<UserCheck size={20} />} label="Attendance" active={activeView === 'attendance'} onClick={setActiveView} />
            <SidebarItem id="exams" icon={<Calendar size={20} />} label="Exams" active={activeView === 'exams'} onClick={setActiveView} />
            <SidebarItem id="internships" icon={<Briefcase size={20} />} label="Internships" active={activeView === 'internships'} onClick={setActiveView} />
            <SidebarItem id="notes" icon={<BookOpen size={20} />} label="Notes" active={activeView === 'notes'} onClick={setActiveView} />
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <p className="text-xs text-slate-500 mb-2">Academic Progress</p>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
              <div className="bg-indigo-600 h-full w-[65%]" />
            </div>
            <p className="text-sm font-bold text-slate-700">65% Semester</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-10 bg-slate-50">
        <header className="flex justify-between items-center mb-8 lg:hidden">
           <button 
             onClick={() => setIsSidebarOpen(true)}
             className="p-2 bg-white rounded-lg shadow-sm border border-slate-200"
           >
             <Menu className="w-6 h-6 text-slate-600" />
           </button>
           <h1 className="text-xl font-bold text-indigo-600">StudentOS</h1>
           <div className="w-10 h-10" /> {/* Spacer */}
        </header>

        <div className="max-w-6xl mx-auto custom-scrollbar overflow-y-auto h-[calc(100vh-80px)] pb-10 pr-2">
          {renderContent()}
        </div>
      </main>

      {/* Notifications Button (Global) */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-all group z-40">
        <Bell className="w-6 h-6 group-hover:animate-swing" />
        <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
      </button>
    </div>
  );
};

export default App;
