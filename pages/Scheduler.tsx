

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { RESOURCES, APPOINTMENTS, BLOCKERS, SERVICES } from '../mockData';
import { Appointment, Resource, User, Business, Blocker } from '../types';
// FIX: Added 'Trash2' to the import from lucide-react.
import { Clock, Calendar as CalendarIcon, Filter, GripVertical, CheckCircle2, Lock, Plus, X, ChevronLeft, ChevronRight, Ban, Trash2 } from 'lucide-react';

// Time settings
const START_HOUR = 8; // 8 AM
const END_HOUR = 18; // 6 PM
const PIXELS_PER_MINUTE = 2.5; // Controls zoom/width for horizontal view
const HEADER_HEIGHT = 48;
const SIDEBAR_WIDTH = 250;

// Layout settings
const MIN_ROW_HEIGHT = 104; 
const EVENT_HEIGHT = 88; 
const EVENT_GAP = 8;

const Scheduler: React.FC = () => {
  const { user, business } = useOutletContext<{ user: User, business: Business }>();

  // [TODO: API INTEGRATION]
  // Fetch Appointments: GET /api/v1/appointments/?start_date={viewDate}&end_date={viewDate}
  // This should ideally use React Query to manage caching and background updates.
  const [appointments, setAppointments] = useState<Appointment[]>(APPOINTMENTS);
  
  // [TODO: API INTEGRATION]
  // Fetch Blockers: GET /api/v1/blockers/?date={viewDate}
  const [blockers, setBlockers] = useState<Blocker[]>(BLOCKERS);
  const [viewDate, setViewDate] = useState(new Date());

  const [zoomLevel, setZoomLevel] = useState(1);
  
  const [draggedAppointmentId, setDraggedAppointmentId] = useState<string | null>(null);
  const [previewState, setPreviewState] = useState<{ resourceId: string; startTime: Date; } | null>(null);
  const [resizeState, setResizeState] = useState<{ appointmentId: string; direction: 'start' | 'end'; startX: number; originalStart: Date; originalDuration: number; } | null>(null);
  
  const [isBlockTimeModalOpen, setIsBlockTimeModalOpen] = useState(false);
  const [newBlocker, setNewBlocker] = useState({ title: 'Break', startTime: '12:00', durationMinutes: 60 });
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => { viewDate.setHours(0, 0, 0, 0); }, [viewDate]);

  // FIX: Defined the missing handleResizeStart function.
  const handleResizeStart = (
    e: React.MouseEvent,
    appointment: Appointment,
    direction: 'start' | 'end'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setResizeState({
      appointmentId: appointment.id,
      direction,
      startX: e.clientX,
      originalStart: new Date(appointment.startTime),
      originalDuration: appointment.durationMinutes,
    });
  };

  useEffect(() => {
    if (!resizeState) return;
    const handleMouseMove = (e: MouseEvent) => {
        const pixelDelta = e.clientX - resizeState.startX;
        const minuteDelta = pixelDelta / (PIXELS_PER_MINUTE * zoomLevel);
        const snappedMinutes = Math.round(minuteDelta / 15) * 15;
        if (snappedMinutes === 0 && resizeState.direction === 'end') return; 

        // [TODO: API INTEGRATION]
        // Optimistic UI Update: We update the state locally immediately.
        // The actual API call happens on `handleMouseUp`.
        setAppointments(prev => prev.map(apt => {
            if (apt.id !== resizeState.appointmentId) return apt;
            let newStart = new Date(resizeState.originalStart);
            let newDuration = resizeState.originalDuration;
            if (resizeState.direction === 'end') {
                newDuration = Math.max(15, resizeState.originalDuration + snappedMinutes);
            } else {
                if (resizeState.originalDuration - snappedMinutes >= 15) {
                     newStart = new Date(resizeState.originalStart.getTime() + snappedMinutes * 60000);
                     newDuration = resizeState.originalDuration - snappedMinutes;
                }
            }
            return { ...apt, startTime: newStart, durationMinutes: newDuration };
        }));
    };
    
    // [TODO: API INTEGRATION]
    // Commit Resize: PATCH /api/v1/appointments/{resizeState.appointmentId}/
    // Body: { duration_minutes: newDuration, start_time: newStart }
    const handleMouseUp = () => setResizeState(null);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizeState, zoomLevel]);

  const getOffset = (date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(START_HOUR, 0, 0, 0);
    const diffMinutes = (date.getTime() - startOfDay.getTime()) / (1000 * 60);
    return Math.max(0, diffMinutes * (PIXELS_PER_MINUTE * zoomLevel));
  };

  const getWidth = (durationMinutes: number) => durationMinutes * (PIXELS_PER_MINUTE * zoomLevel);

  const getStatusColor = (status: Appointment['status'], startTime: Date, endTime: Date) => {
    if (status === 'COMPLETED' || status === 'NO_SHOW') return 'bg-gray-100 border-gray-400 text-gray-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400';
    if (status === 'CANCELLED') return 'bg-gray-100 border-gray-400 text-gray-500 opacity-75 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400';
    const now = new Date();
    if (now > endTime) return 'bg-red-100 border-red-500 text-red-900 dark:bg-red-900/50 dark:border-red-500 dark:text-red-200';
    if (now >= startTime && now <= endTime) return 'bg-yellow-100 border-yellow-500 text-yellow-900 dark:bg-yellow-900/50 dark:border-yellow-500 dark:text-yellow-200';
    return 'bg-blue-100 border-blue-500 text-blue-900 dark:bg-blue-900/50 dark:border-blue-500 dark:text-blue-200';
  };

  // --- RESOURCE AGENDA VIEW ---
  if (user.role === 'resource') {
    // [TODO: API INTEGRATION]
    // Fetch Single Resource: GET /api/v1/resources/me/ or look up via user ID
    const myResource = useMemo(() => RESOURCES.find(r => r.userId === user.id), [user.id]);
    
    const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

    const myAppointments = useMemo(() => appointments.filter(a => a.resourceId === myResource?.id && isSameDay(new Date(a.startTime), viewDate)).sort((a, b) => a.startTime.getTime() - b.startTime.getTime()), [appointments, myResource, viewDate]);
    const myBlockers = useMemo(() => blockers.filter(b => b.resourceId === myResource?.id && isSameDay(new Date(b.startTime), viewDate)).sort((a, b) => a.startTime.getTime() - b.startTime.getTime()), [blockers, myResource, viewDate]);

    const agendaContainerRef = useRef<HTMLDivElement>(null);
    const PIXELS_PER_MINUTE_VERTICAL = 2;
    const timeMarkersVertical = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i).flatMap(h => [`${h}:00`, `${h}:30`]);

    const handleVerticalDragStart = (e: React.DragEvent, appointment: Appointment) => {
      if (!business.resourcesCanReschedule || appointment.status === 'COMPLETED') return e.preventDefault();
      e.dataTransfer.setData('appointmentId', appointment.id);
    };

    const handleVerticalDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!business.resourcesCanReschedule || !agendaContainerRef.current) return;
      const appointmentId = e.dataTransfer.getData('appointmentId');
      const appointment = myAppointments.find(a => a.id === appointmentId);
      if (!appointment || appointment.status === 'COMPLETED') return;

      const rect = agendaContainerRef.current.getBoundingClientRect();
      const dropY = e.clientY - rect.top;
      const minutesFromStart = dropY / PIXELS_PER_MINUTE_VERTICAL;
      const snappedMinutes = Math.round(minutesFromStart / 15) * 15;
      const newStartTime = new Date(viewDate);
      newStartTime.setHours(START_HOUR, snappedMinutes, 0, 0);
      
      // [TODO: API INTEGRATION]
      // Reschedule Appointment: PATCH /api/v1/appointments/{appointmentId}/
      // Body: { start_time: newStartTime }
      setAppointments(prev => prev.map(apt => apt.id === appointmentId ? { ...apt, startTime: newStartTime } : apt));
    };
    
    const handleAddBlocker = () => {
        const [hours, minutes] = newBlocker.startTime.split(':').map(Number);
        const startTime = new Date(viewDate);
        startTime.setHours(hours, minutes, 0, 0);
        
        // [TODO: API INTEGRATION]
        // Create Blocker: POST /api/v1/blockers/
        // Body: { resource_id: myResource.id, title: newBlocker.title, start_time: startTime, duration: ... }
        const newBlock: Blocker = {
            id: `block_${Date.now()}`,
            resourceId: myResource!.id,
            title: newBlocker.title,
            startTime,
            durationMinutes: newBlocker.durationMinutes
        };
        setBlockers(prev => [...prev, newBlock]);
        setIsBlockTimeModalOpen(false);
    };

    const getVerticalOffset = (date: Date) => {
      const startOfDay = new Date(date);
      startOfDay.setHours(START_HOUR, 0, 0, 0);
      const diffMinutes = (date.getTime() - startOfDay.getTime()) / (1000 * 60);
      return diffMinutes * PIXELS_PER_MINUTE_VERTICAL;
    };
    
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Schedule: {myResource?.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">Viewing appointments for {viewDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsBlockTimeModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors shadow-sm"><Plus size={16} /> Block Time</button>
            <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <button onClick={() => setViewDate(d => new Date(d.setDate(d.getDate() - 1)))} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-md"><ChevronLeft size={18} /></button>
                <button onClick={() => setViewDate(new Date())} className="px-3 py-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200 border-x border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">Today</button>
                <button onClick={() => setViewDate(d => new Date(d.setDate(d.getDate() + 1)))} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-md"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>

        <div className="h-[70vh] overflow-y-auto timeline-scroll bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex">
            {/* Time Gutter */}
            <div className="w-20 text-right pr-4 border-r border-gray-100 dark:border-gray-700 shrink-0">
                {timeMarkersVertical.map((time, i) => (
                    <div key={i} className="text-xs text-gray-400 relative" style={{ height: 30 * PIXELS_PER_MINUTE_VERTICAL }}>
                        {time.endsWith(':00') && <span className="absolute -top-1.5">{time}</span>}
                    </div>
                ))}
            </div>

            {/* Agenda */}
            <div ref={agendaContainerRef} className="flex-1 relative" onDragOver={(e) => { if(business.resourcesCanReschedule) e.preventDefault(); }} onDrop={handleVerticalDrop}>
                <div style={{ height: (END_HOUR - START_HOUR) * 60 * PIXELS_PER_MINUTE_VERTICAL }} className="relative">
                    {timeMarkersVertical.map((_, i) => ( <div key={i} className={`absolute w-full ${i % 2 === 0 ? 'border-t border-gray-100 dark:border-gray-700' : 'border-t border-dashed border-gray-100 dark:border-gray-800'}`} style={{ top: i * 30 * PIXELS_PER_MINUTE_VERTICAL }}></div> ))}
                    {[...myAppointments, ...myBlockers].map(item => {
                        const isAppointment = 'customerName' in item;
                        const startTime = new Date(item.startTime);
                        const endTime = new Date(startTime.getTime() + item.durationMinutes * 60000);
                        const isCompleted = isAppointment && item.status === 'COMPLETED';
                        const canDrag = business.resourcesCanReschedule && !isCompleted && isAppointment;
                        
                        const colorClass = isAppointment ? getStatusColor(item.status, startTime, endTime) : 'bg-gray-100 border-gray-300 text-gray-500 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-400';
                        const cursorClass = canDrag ? 'cursor-grab active:cursor-grabbing' : 'cursor-default';
// FIX: Look up service name from serviceId.
                        const service = isAppointment ? SERVICES.find(s => s.id === (item as Appointment).serviceId) : null;

                        return (
                            <div
                                key={item.id}
                                draggable={canDrag}
                                onDragStart={(e) => isAppointment && handleVerticalDragStart(e, item as Appointment)}
                                className={`absolute left-2 right-2 rounded p-3 border-l-4 shadow-sm group overflow-hidden transition-all ${colorClass} ${cursorClass}`}
                                style={{ top: getVerticalOffset(startTime), height: item.durationMinutes * PIXELS_PER_MINUTE_VERTICAL, zIndex: 10,
                                backgroundImage: !isAppointment ? `linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.05) 75%, transparent 75%, transparent)` : undefined, backgroundSize: !isAppointment ? '20px 20px' : undefined
                                 }}
                            >
                                <div className="font-semibold text-sm truncate flex items-center justify-between">
                                  <span>{isAppointment ? (item as Appointment).customerName : item.title}</span>
                                  {isCompleted && <span title="Completed and locked"><Lock size={12} className="text-gray-400 shrink-0" /></span>}
                                </div>
                                {/* FIX: Property 'serviceName' does not exist on type 'Appointment'. Use looked-up service name. */}
                                {isAppointment && <div className="text-xs truncate opacity-80">{service?.name}</div>}
                                <div className="mt-2 flex items-center gap-1 text-xs opacity-75">
                                    {isAppointment && (item as Appointment).status === 'COMPLETED' ? <CheckCircle2 size={12} /> : isAppointment ? <Clock size={12} /> : <Ban size={12} />}
                                    <span>{startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
        {isBlockTimeModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsBlockTimeModalOpen(false)}>
              <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700"><h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Time Off</h3><button onClick={() => setIsBlockTimeModalOpen(false)} className="p-1 text-gray-400 hover:bg-gray-100 rounded-full"><X size={20} /></button></div>
                <div className="p-6 space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label><input type="text" value={newBlocker.title} onChange={e => setNewBlocker(s => ({...s, title: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none" /></div>
                    <div className="grid grid-cols-2 gap-4">
                         <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label><input type="time" value={newBlocker.startTime} onChange={e => setNewBlocker(s => ({...s, startTime: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none" /></div>
                         <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (min)</label><input type="number" step="15" min="15" value={newBlocker.durationMinutes} onChange={e => setNewBlocker(s => ({...s, durationMinutes: parseInt(e.target.value, 10)}))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none" /></div>
                    </div>
                    <div className="pt-2 flex justify-end gap-3"><button onClick={() => setIsBlockTimeModalOpen(false)} className="px-4 py-2 text-sm font-medium rounded-lg">Cancel</button><button onClick={handleAddBlocker} className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700">Add Block</button></div>
                </div>
              </div>
            </div>
        )}
      </div>
    );
  }

  // --- OWNER/MANAGER/STAFF HORIZONTAL TIMELINE VIEW ---
  const resourceLayouts = useMemo(() => {
    // [TODO: API INTEGRATION]
    // Fetch Resources: GET /api/v1/resources/
    return RESOURCES.map(resource => {
      const allResourceApps = appointments.filter(a => a.resourceId === resource.id);
      const layoutApps = allResourceApps.filter(a => a.id !== draggedAppointmentId);

      if (previewState && previewState.resourceId === resource.id && draggedAppointmentId) {
         const original = appointments.find(a => a.id === draggedAppointmentId);
         if (original) {
             layoutApps.push({ ...original, startTime: previewState.startTime, id: 'PREVIEW' });
         }
      }
      
      layoutApps.sort((a, b) => a.startTime.getTime() - b.startTime.getTime() || b.durationMinutes - a.durationMinutes);

      const lanes: number[] = []; 
      const visibleAppointments = layoutApps.map(apt => {
        const start = apt.startTime.getTime();
        const end = start + apt.durationMinutes * 60000;
        let laneIndex = -1;
        
        for (let i = 0; i < lanes.length; i++) {
          if (lanes[i] <= start) {
            laneIndex = i;
            lanes[i] = end;
            break;
          }
        }
        if (laneIndex === -1) {
          lanes.push(end);
          laneIndex = lanes.length - 1;
        }
        return { ...apt, laneIndex };
      });

      const laneCount = Math.max(1, lanes.length);
      const requiredHeight = Math.max(MIN_ROW_HEIGHT, (laneCount * (EVENT_HEIGHT + EVENT_GAP)) + EVENT_GAP);
      const finalAppointments = [...visibleAppointments, ...allResourceApps.filter(a => a.id === draggedAppointmentId).map(a => ({...a, laneIndex: 0}))];

      return { resource, height: requiredHeight, appointments: finalAppointments, laneCount };
    });
  }, [appointments, draggedAppointmentId, previewState]); 

  const handleDragStart = (e: React.DragEvent, appointmentId: string) => {
    if (resizeState) return e.preventDefault();
    e.dataTransfer.setData('appointmentId', appointmentId);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => setDraggedAppointmentId(appointmentId), 0);
  };

  const handleDragEnd = () => { setDraggedAppointmentId(null); setPreviewState(null); };

  const handleTimelineDragOver = (e: React.DragEvent) => {
    if (resizeState) return;
    e.preventDefault(); e.dataTransfer.dropEffect = 'move';
    if (!scrollContainerRef.current || !draggedAppointmentId) return;

    const container = scrollContainerRef.current;
    const rect = container.getBoundingClientRect();
    const offsetX = e.clientX - rect.left + container.scrollLeft;
    const offsetY = e.clientY - rect.top + container.scrollTop - HEADER_HEIGHT;
    if (offsetY < 0) return;

    let targetResourceId: string | null = null;
    for (let i = 0, currentTop = 0; i < resourceLayouts.length; i++) {
        if (offsetY >= currentTop && offsetY < currentTop + resourceLayouts[i].height) {
            targetResourceId = resourceLayouts[i].resource.id; break;
        }
        currentTop += resourceLayouts[i].height;
    }
    if (!targetResourceId) return;

    const newStartMinutes = Math.round((offsetX / (PIXELS_PER_MINUTE * zoomLevel)) / 15) * 15;
    const newStartTime = new Date(viewDate);
    newStartTime.setHours(START_HOUR, newStartMinutes, 0, 0);

    if (!previewState || previewState.resourceId !== targetResourceId || previewState.startTime.getTime() !== newStartTime.getTime()) {
      setPreviewState({ resourceId: targetResourceId, startTime: newStartTime });
    }
  };

  const handleTimelineDrop = (e: React.DragEvent) => {
    e.preventDefault(); if (resizeState) return;
    const appointmentId = e.dataTransfer.getData('appointmentId');
    if (appointmentId && previewState) {
        // [TODO: API INTEGRATION]
        // Move Appointment: PATCH /api/v1/appointments/{appointmentId}/
        // Body: { resource_id: previewState.resourceId, start_time: previewState.startTime }
        setAppointments(prev => prev.map(apt => apt.id === appointmentId ? { ...apt, startTime: previewState.startTime, resourceId: previewState.resourceId, status: apt.status === 'PENDING' ? 'CONFIRMED' : apt.status } : apt));
    }
    setDraggedAppointmentId(null); setPreviewState(null);
  };

  const handleDropToPending = (e: React.DragEvent) => {
      e.preventDefault(); const appointmentId = e.dataTransfer.getData('appointmentId');
      // [TODO: API INTEGRATION]
      // Unassign Appointment: PATCH /api/v1/appointments/{appointmentId}/
      // Body: { resource_id: null, status: 'PENDING' }
      if (appointmentId) setAppointments(prev => prev.map(apt => apt.id === appointmentId ? { ...apt, resourceId: null, status: 'PENDING' } : apt));
      setDraggedAppointmentId(null); setPreviewState(null);
  };

  const handleDropToArchive = (e: React.DragEvent) => {
      e.preventDefault(); const appointmentId = e.dataTransfer.getData('appointmentId');
      // [TODO: API INTEGRATION]
      // Delete/Archive Appointment: DELETE /api/v1/appointments/{appointmentId}/
      if (appointmentId) setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
      setDraggedAppointmentId(null); setPreviewState(null);
  };

  const handleSidebarDragOver = (e: React.DragEvent) => {
      e.preventDefault(); e.dataTransfer.dropEffect = 'move';
      if (previewState) setPreviewState(null);
  };

  const timeMarkers = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
  const timelineWidth = (END_HOUR - START_HOUR) * 60 * (PIXELS_PER_MINUTE * zoomLevel);
  const pendingAppointments = appointments.filter(a => !a.resourceId);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden select-none bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm shrink-0 z-10 transition-colors duration-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-200 font-medium transition-colors duration-200">
            <CalendarIcon size={16} />
            <span>Today, {new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}>-</button>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Zoom</span>
            <button className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}>+</button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors shadow-sm">
            + New Appointment
          </button>
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shrink-0 shadow-lg z-20 transition-colors duration-200" style={{ width: SIDEBAR_WIDTH }}>
            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center px-4 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider shrink-0 transition-colors duration-200" style={{ height: HEADER_HEIGHT }}>Resources</div>
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="overflow-y-auto flex-1">
                    {resourceLayouts.map(layout => (
                        <div key={layout.resource.id} className="flex items-center px-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group" style={{ height: layout.height }}>
                            <div className="flex items-center gap-3 w-full">
                                <div className="flex items-center justify-center w-8 h-8 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-brand-100 dark:group-hover:bg-brand-900 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors shrink-0"><GripVertical size={16} /></div>
                                <div>
                                    <p className="font-medium text-sm text-gray-900 dark:text-white">{layout.resource.name}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 capitalize flex items-center gap-1">{layout.resource.type.toLowerCase()} {layout.laneCount > 1 && <span className="text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/50 px-1 rounded text-[10px]">{layout.laneCount} lanes</span>}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
             <div className={`border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 h-80 flex flex-col transition-colors duration-200 ${draggedAppointmentId ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`} onDragOver={handleSidebarDragOver} onDrop={handleDropToPending}>
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2 shrink-0"><Clock size={12} /> Pending Requests ({pendingAppointments.length})</h3>
                <div className="space-y-2 overflow-y-auto flex-1 mb-2">
                    {pendingAppointments.length === 0 && !draggedAppointmentId && (<div className="text-xs text-gray-400 italic text-center py-4">No pending requests</div>)}
                    {draggedAppointmentId && (<div className="border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg p-4 text-center mb-2 bg-blue-50 dark:bg-blue-900/30"><span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Drop here to unassign</span></div>)}
                    {pendingAppointments.map(apt => {
                        // FIX: Property 'serviceName' does not exist on type 'Appointment'. Use looked-up service name.
                        const service = SERVICES.find(s => s.id === apt.serviceId);
                        return (<div key={apt.id} className={`p-3 bg-white dark:bg-gray-700 border border-l-4 border-gray-200 dark:border-gray-600 border-l-orange-400 dark:border-l-orange-500 rounded shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${draggedAppointmentId === apt.id ? 'opacity-50' : ''}`} draggable onDragStart={(e) => handleDragStart(e, apt.id)} onDragEnd={handleDragEnd}><p className="font-semibold text-sm text-gray-900 dark:text-white">{apt.customerName}</p><p className="text-xs text-gray-500 dark:text-gray-400">{service?.name}</p><div className="mt-2 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500"><Clock size={10} /> {apt.durationMinutes} min</div></div>)
                    })}
                </div>
                <div className={`shrink-0 mt-2 border-t border-gray-200 dark:border-gray-700 pt-2 transition-all duration-200 ${draggedAppointmentId ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-0'}`} onDragOver={handleSidebarDragOver} onDrop={handleDropToArchive}><div className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed transition-colors ${draggedAppointmentId ? 'border-red-300 bg-red-50 text-red-600 dark:border-red-700 dark:bg-red-900/30 dark:text-red-400' : 'border-gray-200 dark:border-gray-700 bg-transparent text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-500'}`}><Trash2 size={16} /><span className="text-xs font-medium">Drop here to archive</span></div></div>
            </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900 relative transition-colors duration-200">
            <div className="flex-1 overflow-auto timeline-scroll" ref={scrollContainerRef} onDragOver={handleTimelineDragOver} onDrop={handleTimelineDrop}>
                <div style={{ width: timelineWidth, minWidth: '100%' }} className="relative min-h-full">
                    <div className="sticky top-0 z-10 flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-colors duration-200" style={{ height: HEADER_HEIGHT }}>{timeMarkers.map(hour => (<div key={hour} className="flex-shrink-0 border-r border-gray-200 dark:border-gray-700 px-2 py-2 text-xs font-medium text-gray-400 select-none" style={{ width: 60 * (PIXELS_PER_MINUTE * zoomLevel) }}>{hour > 12 ? `${hour - 12} PM` : `${hour} ${hour === 12 ? 'PM' : 'AM'}`}</div>))}</div>
                    <div className="absolute top-0 bottom-0 border-l-2 border-red-500 z-30 pointer-events-none" style={{ left: getOffset(new Date()), marginTop: HEADER_HEIGHT }}><div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full"></div></div>
                    <div className="relative">
                        <div className="absolute inset-0 pointer-events-none">{timeMarkers.map(hour => (<div key={hour} className="absolute top-0 bottom-0 border-r border-dashed border-gray-100 dark:border-gray-800" style={{ left: (hour - START_HOUR) * 60 * (PIXELS_PER_MINUTE * zoomLevel) }}></div>))}</div>
                        {resourceLayouts.map(layout => (<div key={layout.resource.id} className="relative border-b border-gray-100 dark:border-gray-800 transition-colors" style={{ height: layout.height }}>{layout.appointments.map(apt => {
                            const isPreview = apt.id === 'PREVIEW'; const isDragged = apt.id === draggedAppointmentId; const startTime = new Date(apt.startTime); const endTime = new Date(startTime.getTime() + apt.durationMinutes * 60000); const colorClass = isPreview ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-400 dark:border-brand-700 border-dashed text-brand-700 dark:text-brand-400 opacity-80' : getStatusColor(apt.status, startTime, endTime); const topOffset = (apt.laneIndex * (EVENT_HEIGHT + EVENT_GAP)) + EVENT_GAP;
                            // FIX: Property 'serviceName' does not exist on type 'Appointment'. Use looked-up service name.
                            const service = SERVICES.find(s => s.id === apt.serviceId);
                            return (<div key={apt.id} className={`absolute rounded p-3 border-l-4 shadow-sm group overflow-hidden transition-all ${colorClass} ${isPreview ? 'z-40' : 'hover:shadow-md hover:z-50'} ${isDragged ? 'opacity-0 pointer-events-none' : ''}`} style={{ left: getOffset(startTime), width: getWidth(apt.durationMinutes), height: EVENT_HEIGHT, top: topOffset, zIndex: isPreview ? 40 : 10 + apt.laneIndex, cursor: resizeState ? 'grabbing' : 'grab', pointerEvents: isPreview ? 'none' : 'auto' }} draggable={!resizeState && !isPreview} onDragStart={(e) => handleDragStart(e, apt.id)} onDragEnd={handleDragEnd}>
                                {!isPreview && (<><div className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 hover:bg-black/10 z-20" onMouseDown={(e) => handleResizeStart(e, apt, 'start')} /><div className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 hover:bg-black/10 z-20" onMouseDown={(e) => handleResizeStart(e, apt, 'end')} /></>)}
                                <div className="font-semibold text-sm truncate pointer-events-none">{apt.customerName}</div><div className="text-xs truncate opacity-80 pointer-events-none">{service?.name}</div><div className="mt-2 flex items-center gap-1 text-xs opacity-75 pointer-events-none">{apt.status === 'COMPLETED' ? <CheckCircle2 size={12} /> : <Clock size={12} />}<span>{startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span><span className="mx-1">•</span><span>{apt.durationMinutes} min</span></div>
                            </div>);
                        })}</div>))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
