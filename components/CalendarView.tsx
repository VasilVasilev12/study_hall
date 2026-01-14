import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  addMonths,
  subMonths
} from 'date-fns';
import { CalendarEvent, EventType } from '../types';
import { ChevronLeft, ChevronRight, Plus, Clock, BookOpen, GraduationCap, Trash2, CheckSquare, Square } from 'lucide-react';

interface CalendarViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onAddEvent, onDeleteEvent, onToggleComplete }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState<EventType>('study');
  const [newEventDesc, setNewEventDesc] = useState('');

  // Calendar Math
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && newEventTitle) {
      onAddEvent({
        title: newEventTitle,
        date: selectedDate,
        type: newEventType,
        description: newEventDesc,
        completed: false
      });
      setShowModal(false);
      setNewEventTitle('');
      setNewEventDesc('');
      setNewEventType('study');
    }
  };

  const renderEventIcon = (type: EventType) => {
    switch(type) {
      case 'exam': return <GraduationCap size={14} className="text-red-400" />;
      case 'class': return <BookOpen size={14} className="text-blue-400" />;
      default: return <Clock size={14} className="text-green-400" />;
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Schedule</h2>
          <p className="text-slate-400">Track your classes and exams.</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-lg border border-slate-800 shadow-sm">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-slate-800 rounded-md text-slate-300">
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-semibold w-32 text-center select-none text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-slate-800 rounded-md text-slate-300">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-800">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-900">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 grid-rows-5 flex-1 auto-rows-fr">
          {calendarDays.map((day, dayIdx) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isTodayDate = isToday(day);

            return (
              <div 
                key={day.toString()}
                className={`min-h-[100px] md:min-h-0 border-b border-r border-slate-800 p-2 transition-colors flex flex-col gap-1
                  ${!isCurrentMonth ? 'bg-slate-950/50 text-slate-600' : 'bg-slate-900'}
                  ${isTodayDate ? 'bg-brand-900/10' : ''}
                `}
              >
                <div className="flex justify-between items-start">
                  <div 
                    onClick={() => handleDayClick(day)}
                    className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 cursor-pointer hover:bg-slate-700 transition-colors
                      ${isTodayDate ? 'bg-brand-600 text-white' : 'text-slate-400'}
                    `}
                  >
                    {format(day, 'd')}
                  </div>
                  <button 
                     onClick={(e) => { e.stopPropagation(); handleDayClick(day); }}
                     className="text-slate-600 hover:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                
                {/* Events List for this day */}
                <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id} 
                      className={`group/event text-[10px] md:text-xs px-1.5 py-1 rounded border flex items-center justify-between gap-1
                        ${event.completed ? 'opacity-60 grayscale' : ''}
                        ${event.type === 'exam' ? 'bg-red-900/20 border-red-900/30 text-red-300' : 
                          event.type === 'class' ? 'bg-blue-900/20 border-blue-900/30 text-blue-300' : 
                          'bg-green-900/20 border-green-900/30 text-green-300'}
                      `}
                    >
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                         <button 
                           onClick={(e) => { e.stopPropagation(); onToggleComplete(event.id); }}
                           className="hover:text-white transition-colors flex-shrink-0"
                         >
                           {event.completed ? <CheckSquare size={10} /> : <Square size={10} />}
                         </button>
                         <span className={`truncate ${event.completed ? 'line-through' : ''}`}>
                           {event.title}
                         </span>
                      </div>
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteEvent(event.id); }}
                        className="opacity-0 group-hover/event:opacity-100 text-slate-400 hover:text-red-400 transition-all flex-shrink-0"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-800 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-4 text-white">
              Add Event for {selectedDate ? format(selectedDate, 'MMM do') : ''}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Event Title</label>
                <input
                  autoFocus
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-white placeholder:text-slate-500"
                  placeholder="e.g., Calculus Exam"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['class', 'exam', 'study'] as EventType[]).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewEventType(type)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium capitalize border transition-colors
                        ${newEventType === type 
                          ? 'bg-slate-700 text-white border-slate-600' 
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'}
                      `}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description (Optional)</label>
                <textarea
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none h-20 resize-none text-white placeholder:text-slate-500"
                  placeholder="Room numbers, chapters to study..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold shadow-lg shadow-brand-500/20 transition-all active:scale-95"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};