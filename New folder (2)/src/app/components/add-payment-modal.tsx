import React, { useRef, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  X,
  Plus,
  User,
  Calendar,
  Minus,
  Square,
  Search,
  Check,
  Clock,
  AlertCircle,
  XCircle,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { PaymentRecord, PaymentStatus } from "../types";

interface PaymentModalProps {
  onSave: (
    payment: Omit<PaymentRecord, "id" | "recordedAt">,
  ) => void;
  onDelete?: (id: string) => void;
  initialData?: PaymentRecord;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const MOCK_WORKERS = [
  "Alex Johnson",
  "Sarah Williams",
  "Michael Chen",
  "Jessica Davis",
  "David Smith",
  "Emma Wilson",
  "Chris Evans",
  "Olivia Brown",
  "Ryan Garcia",
  "Sophia Martinez",
];



interface StatusOption {
  value: PaymentStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: "Completed",
    label: "Completed",
    icon: <Check className="w-4 h-4" />,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/30",
    description: "Payment successfully processed",
  },
  {
    value: "Pending",
    label: "Pending",
    icon: <Clock className="w-4 h-4" />,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/30",
    description: "Awaiting confirmation or processing",
  },
  {
    value: "Processing",
    label: "Processing",
    icon: <RotateCcw className="w-4 h-4" />,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/30",
    description: "Payment is currently being processed",
  },
  {
    value: "Failed",
    label: "Failed",
    icon: <XCircle className="w-4 h-4" />,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/30",
    description: "Payment failed or was declined",
  },
  {
    value: "Cancelled",
    label: "Cancelled",
    icon: <AlertCircle className="w-4 h-4" />,
    color: "text-gray-400",
    bgColor: "bg-gray-400/10",
    borderColor: "border-gray-400/30",
    description: "Payment was cancelled by user or system",
  },
  {
    value: "Refunded",
    label: "Refunded",
    icon: <RotateCcw className="w-4 h-4" />,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/30",
    description: "Payment has been refunded to worker",
  },
  {
    value: "On Hold",
    label: "On Hold",
    icon: <AlertCircle className="w-4 h-4" />,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "border-orange-400/30",
    description: "Payment temporarily suspended",
  },
];

export const PaymentModal: React.FC<PaymentModalProps> = ({
  onSave,
  onDelete,
  initialData,
  trigger,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open =
    controlledOpen !== undefined
      ? controlledOpen
      : internalOpen;
  const setOpen =
    onOpenChange !== undefined ? onOpenChange : (setInternalOpen as (open: boolean) => void);

  const [isWorkerModalOpen, setIsWorkerModalOpen] =
    useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] =
    useState(false);
  const [workerSearch, setWorkerSearch] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef(false);
  const rectRef = useRef<DOMRect | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const lastPointRef = useRef<{ x: number, y: number } | null>(null);

  const [formData, setFormData] = useState({
    workerName: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    method: "Cash",
    notes: "",
    status: "Completed" as PaymentStatus,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isTouched, setIsTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (name: keyof typeof formData | "signature", value: any) => {
    let error = "";
    if (name === "workerName" && !value) error = "Personnel name is required";
    if (name === "amount") {
      const num = parseFloat(value as string);
      if (isNaN(num)) error = "Invalid amount format";
      else if (num <= 0) error = "Amount must be greater than zero";
    }
    if (name === "signature" && !hasSignature && !initialData) error = "Signature verification required";
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleBlur = (name: keyof typeof formData) => {
    setIsTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        workerName: initialData.workerName,
        amount: initialData.amount.toString(),
        date: initialData.date,
        method: initialData.method,
        notes: initialData.notes,
        status: (initialData.status as PaymentStatus) || "Completed",
      });
    } else {
      setFormData({
        workerName: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        method: "Cash",
        notes: "",
        status: "Completed",
      });
    }
  }, [initialData, open]);

  const initCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    // Always use exactly what the DOM says, scaled by DPR for absolute sharpness
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return; // Hidden or anim state

    const dpr = window.devicePixelRatio || 1;
    const newWidth = rect.width * dpr;
    const newHeight = rect.height * dpr;

    // Only set if changed to avoid clearing
    if (canvas.width !== newWidth || canvas.height !== newHeight) {
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Warning: We are intentionally NOT using ctx.scale(dpr, dpr). 
        // We will scale coordinates inside getPos instead to be 100% bug-free.
        ctx.strokeStyle = "#000000"; // Pitch black ink
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 3 * dpr; // Scale line thickness manually
        ctxRef.current = ctx;
      }
    }

    // Attach native high-performance pointer event listener explicitly
    canvas.onpointermove = (e: PointerEvent) => {
      if (!isDrawingRef.current || !ctxRef.current) return;
      
      const dpr = window.devicePixelRatio || 1;
      const rect = rectRef.current || canvas.getBoundingClientRect();
      
      const drawPoint = (clientX: number, clientY: number) => {
        const x = (clientX - rect.left) * dpr;
        const y = (clientY - rect.top) * dpr;
        const lastPoint = lastPointRef.current;
        if (lastPoint) {
          ctxRef.current!.beginPath();
          ctxRef.current!.moveTo(lastPoint.x, lastPoint.y);
          ctxRef.current!.lineTo(x, y);
          ctxRef.current!.stroke();
        }
        lastPointRef.current = { x, y };
      };

      // Extract all high-frequency points between frames for zero-lag silky smooth drawing
      if (typeof e.getCoalescedEvents === 'function') {
        const events = e.getCoalescedEvents();
        if (events && events.length > 0) {
          for (let ev of events) {
            drawPoint(ev.clientX, ev.clientY);
          }
          return;
        }
      }
      
      drawPoint(e.clientX, e.clientY);
    };
  };

  // We only run initialization on mount and when modal finishes opening
  useEffect(() => {
    if (open && !initialData) {
      // Small delayed loop to guarantee Radix Modal has fully positioned
      const ids = [0, 50, 200, 350].map(delay => 
        setTimeout(() => initCanvas(), delay)
      );
      return () => ids.forEach(clearTimeout);
    }
  }, [open, initialData]);



  const getPos = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    if (!rectRef.current) return { x: 0, y: 0 };
    const rect = rectRef.current;
    const dpr = window.devicePixelRatio || 1;
    
    let clientX, clientY;
    if ('touches' in e && (e as React.TouchEvent).touches.length > 0) {
      clientX = (e as React.TouchEvent).touches[0].clientX;
      clientY = (e as React.TouchEvent).touches[0].clientY;
    } else {
      clientX = (e as React.PointerEvent).clientX;
      clientY = (e as React.PointerEvent).clientY;
    }
    
    // Mathematical certainty: Logical CSS pixel coordinate multiplied by DPR
    return {
      x: (clientX - rect.left) * dpr,
      y: (clientY - rect.top) * dpr
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    initCanvas(); // Final safety initialize just in case user clicked immediately
    
    // Cache the bounding box EXACTLY ONCE when the pen touches down to prevent massive input lag
    if (canvasRef.current) {
      rectRef.current = canvasRef.current.getBoundingClientRect();
    }
    
    isDrawingRef.current = true;
    const pos = getPos(e);
    lastPointRef.current = pos;
    
    if (ctxRef.current) {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(pos.x, pos.y);
      ctxRef.current.lineTo(pos.x + 0.1, pos.y + 0.1); 
      ctxRef.current.stroke();
    }
    
    if (!hasSignature) setHasSignature(true);
    if (errors.signature) setErrors(prev => ({ ...prev, signature: "" }));
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const clearSignature = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
      setHasSignature(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let signature: string | undefined = undefined;
    if (hasSignature && canvasRef.current && !initialData) {
      signature = canvasRef.current.toDataURL();
    }

    onSave({
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      signature: signature || initialData?.signature,
    });
    setOpen(false);
  };

  const filteredWorkers = MOCK_WORKERS.filter((w) =>
    w.toLowerCase().includes(workerSearch.toLowerCase()),
  );

  const currentStatus = STATUS_OPTIONS.find(s => s.value === formData.status) || STATUS_OPTIONS[0];

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        {trigger && (
          <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
        )}
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 animate-in fade-in duration-300" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px] bg-[#0d0d0d]/90 border border-white/[0.08] rounded-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] z-50 overflow-hidden focus:outline-none flex flex-col max-h-[95vh] backdrop-blur-2xl animate-in zoom-in-95 fade-in duration-300">
            <Dialog.Title className="sr-only">
              {initialData
                ? "Update Payment Record"
                : "Record New Payment"}
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Form to {initialData ? "edit" : "record"} a
              payment transaction with worker details and
              signature.
            </Dialog.Description>

            {/* Modern Integrated Title Bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#ff4d00]/10 flex items-center justify-center rounded-lg border border-[#ff4d00]/20 shadow-[0_0_15px_rgba(255,77,0,0.1)]">
                  {initialData ? (
                    <Search className="w-4 h-4 text-[#ff4d00]" />
                  ) : (
                    <Plus className="w-4 h-4 text-[#ff4d00]" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {initialData ? "Update Record" : "New Payment"}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                    WonderPay Financial Management
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-white/[0.05] text-gray-500 hover:text-gray-300 transition-all duration-200">
                  <Minus className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/[0.05] text-gray-500 hover:text-gray-300 transition-all duration-200">
                  <Square className="w-3.5 h-3.5" />
                </button>
                <Dialog.Close asChild>
                  <button className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-gray-500 transition-all duration-200">
                    <X className="w-4 h-4" />
                  </button>
                </Dialog.Close>
              </div>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar bg-gradient-to-b from-transparent to-white/[0.01]">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-[2px] w-8 bg-[#ff4d00]"></div>
                <h2 className="text-[#ff4d00] text-xs font-black uppercase tracking-[0.2em]">
                  Transaction Details
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Worker Name Row */}
                <div className="grid grid-cols-[120px_1fr_auto] items-center gap-3">
                  <label className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                    Worker Name:
                  </label>
                  <input
                    type="text"
                    placeholder="Type name..."
                    className="bg-white/[0.03] border border-white/[0.08] px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#ff4d00]/50 focus:ring-1 focus:ring-[#ff4d00]/20 rounded-xl w-full transition-all duration-200"
                    value={formData.workerName}
                    onChange={(e) => {
                      setFormData({ ...formData, workerName: e.target.value });
                      if (isTouched.workerName) validateField("workerName", e.target.value);
                    }}
                    onBlur={() => handleBlur("workerName")}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsWorkerModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 hover:text-white rounded-xl text-xs font-semibold border border-white/[0.1] transition-all duration-200 shadow-sm"
                  >
                    <User className="w-4 h-4" />
                    <span>Select</span>
                  </button>
                  {isTouched.workerName && errors.workerName && (
                    <div className="col-start-2 flex items-center gap-1.5 mt-1 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                      <AlertCircle className="w-3 h-3" />
                      {errors.workerName}
                    </div>
                  )}
                </div>

                {/* Amount Row */}
                <div className="grid grid-cols-[120px_1fr] items-center gap-3">
                  <label className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                    Amount:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="₵0.00"
                      className="bg-white/[0.03] border border-white/[0.08] px-10 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#ff4d00]/50 focus:ring-1 focus:ring-[#ff4d00]/20 rounded-xl w-full transition-all duration-200"
                      value={formData.amount}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          amount: e.target.value,
                        });
                        if (isTouched.amount) validateField("amount", e.target.value);
                      }}
                      onBlur={() => handleBlur("amount")}
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₵</div>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col">
                      <button type="button" className="text-gray-600 hover:text-[#ff4d00] transition-colors"><ChevronUp className="w-3.5 h-3.5" /></button>
                      <button type="button" className="text-gray-600 hover:text-[#ff4d00] transition-colors"><ChevronDown className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  {isTouched.amount && errors.amount && (
                    <div className="col-start-2 flex items-center gap-1.5 mt-1 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                      <AlertCircle className="w-3 h-3" />
                      {errors.amount}
                    </div>
                  )}
                </div>

                {/* Payment Date Row */}
                <div className="grid grid-cols-[120px_1fr] items-center gap-3">
                  <label className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                    Payment Date:
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className="bg-white/[0.03] border border-white/[0.08] px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#ff4d00]/50 rounded-xl w-full appearance-none transition-all duration-200"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          date: e.target.value,
                        })
                      }
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Payment Method Row */}
                <div className="grid grid-cols-[120px_1fr] items-center gap-3">
                  <label className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                    Payment Method:
                  </label>
                  <div className="relative">
                    <select
                      className="bg-white/[0.03] border border-white/[0.08] px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#ff4d00]/50 rounded-xl w-full appearance-none transition-all duration-200"
                      value={formData.method}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          method: e.target.value,
                        })
                      }
                    >
                      <option value="Cash">Cash Transfer</option>
                      <option value="Check">Business Check</option>
                      <option value="Bank Transfer">Wire Transfer</option>
                      <option value="Mobile Money">Mobile Wallet</option>
                      <option value="Other">Other Method</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Payment Status Row */}
                <div className="grid grid-cols-[120px_1fr_auto] items-center gap-3">
                  <label className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                    Status:
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsStatusModalOpen(true)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-300 w-full text-left backdrop-blur-sm ${currentStatus.bgColor.replace('/10', '/5')} ${currentStatus.borderColor.replace('/30', '/10')} hover:border-[#ff4d00]/30 group`}
                  >
                    <div className={`p-1.5 rounded-lg bg-white/[0.03] transition-transform duration-300 group-hover:scale-110 ${currentStatus.color}`}>
                      {currentStatus.icon}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-bold tracking-tight ${currentStatus.color}`}>
                        {currentStatus.label}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">Status Live</span>
                       <ChevronDown className="w-4 h-4 text-gray-500" />
                    </div>
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsStatusModalOpen(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#ff4d00]/5 hover:bg-[#ff4d00]/10 text-[#ff4d00] rounded-xl text-xs font-bold border border-[#ff4d00]/20 transition-all duration-200"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Action</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 mt-2">
                  <label className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                    Transaction Notes:
                  </label>
                  <textarea
                    placeholder="Enter any additional notes..."
                    className="w-full bg-white/[0.03] border border-white/[0.08] p-4 text-sm text-gray-300 focus:outline-none focus:border-[#ff4d00]/50 rounded-xl min-h-[80px] resize-none transition-all duration-200"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notes: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Worker Signature - Hidden in Edit Mode */}
                {!initialData && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                        Verification Signature:
                      </label>
                      {hasSignature && (
                         <span className="text-[10px] bg-[#ff4d00]/10 text-[#ff4d00] px-3 py-1 rounded-full border border-[#ff4d00]/20 font-bold tracking-tight animate-pulse">
                           SECURE INPUT ACTIVE
                         </span>
                       )}
                    </div>
                    <div className={`bg-white rounded-xl overflow-hidden h-[130px] relative border-2 shadow-inner transition-colors duration-300 ${
                      isTouched.signature && errors.signature ? 'border-red-500/50' : 'border-white/[0.05]'
                    }`}>
                      <canvas
                        ref={canvasRef}
                        onPointerDown={startDrawing}
                        onPointerUp={stopDrawing}
                        onPointerLeave={stopDrawing}
                        className="w-full h-full touch-none cursor-crosshair"
                      />
                    </div>
                    {isTouched.signature && errors.signature && (
                      <div className="flex items-center gap-1.5 mt-1 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                        <AlertCircle className="w-3 h-3" />
                        {errors.signature}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="w-full py-2.5 rounded-xl text-gray-400 hover:text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 border border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.02]"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Clear Signature Pad</span>
                    </button>
                  </div>
                )}

                <div className="pt-8 flex gap-4 sticky bottom-0 bg-[#0d0d0d] pb-2 mt-4">
                  <div className="flex-1 flex gap-3">
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="flex-1 px-8 py-3.5 rounded-xl text-gray-400 hover:text-white font-bold text-sm transition-all duration-200 border border-white/[0.05] hover:bg-white/[0.03]"
                      >
                        Dismiss
                      </button>
                    </Dialog.Close>
                    {initialData && onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(initialData.id)}
                        className="px-6 py-3.5 rounded-xl text-red-500 hover:text-white hover:bg-red-500/20 transition-all font-bold text-sm border border-red-500/20"
                        title="Delete Record"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="flex-[2] bg-[#ff4d00] hover:bg-[#ff5d14] text-white font-bold py-3.5 px-8 rounded-xl transition-all active:scale-[0.98] text-sm shadow-[0_10px_20px_-5px_rgba(255,77,0,0.4)] relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      !formData.workerName || 
                      !formData.amount || 
                      (Object.values(errors).some(e => !!e)) ||
                      (!hasSignature && !initialData)
                    }
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform duration-500"></div>
                    <span className="relative z-10">
                      {initialData ? "Confirm Changes" : "Create Transaction"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Worker Selection Sub-Modal */}
      <Dialog.Root
        open={isWorkerModalOpen}
        onOpenChange={setIsWorkerModalOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] animate-in fade-in duration-300" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] bg-[#0d0d0d]/95 border border-white/[0.08] rounded-2xl shadow-3xl z-[70] overflow-hidden focus:outline-none backdrop-blur-2xl animate-in zoom-in-95 duration-300">
            <Dialog.Title className="sr-only">
              Select Worker
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Choose a worker from the list to populate the payment form.
            </Dialog.Description>

            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#ff4d00]/10 flex items-center justify-center rounded-lg border border-[#ff4d00]/20">
                  <User className="w-4 h-4 text-[#ff4d00]" />
                </div>
                <span className="text-sm font-bold text-white tracking-tight">Select Personnel</span>
              </div>
              <Dialog.Close asChild>
                <button className="p-2 rounded-lg hover:bg-white/[0.05] text-gray-500 hover:text-gray-300 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="p-4 space-y-4">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search personnel directory..."
                  className="w-full bg-white/[0.03] border border-white/[0.08] pl-10 pr-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#ff4d00]/50 rounded-xl transition-all duration-200"
                  value={workerSearch}
                  onChange={(e) =>
                    setWorkerSearch(e.target.value)
                  }
                  autoFocus
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#ff4d00] transition-colors" />
              </div>

              <div className="max-h-[350px] overflow-y-auto border border-white/[0.06] rounded-xl bg-white/[0.01] custom-scrollbar">
                {filteredWorkers.length > 0 ? (
                  filteredWorkers.map((worker) => (
                    <button
                      key={worker}
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          workerName: worker,
                        });
                        setIsWorkerModalOpen(false);
                        setWorkerSearch("");
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 text-left text-sm text-gray-300 hover:bg-[#ff4d00]/10 hover:text-white transition-all duration-200 group border-b border-white/[0.05] last:border-b-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 bg-white/[0.05] rounded-full flex items-center justify-center text-[10px] font-black group-hover:bg-[#ff4d00] group-hover:text-white transition-all duration-300">
                          {worker
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="font-semibold tracking-tight">{worker}</span>
                      </div>
                      {formData.workerName === worker && (
                        <Check className="w-4 h-4 text-[#ff4d00]" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500 italic text-xs">
                    No workers found matching "{workerSearch}"
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Dialog.Close asChild>
                  <button className="px-6 py-2.5 text-gray-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">
                    Close
                  </button>
                </Dialog.Close>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Status Selection Sub-Modal - NEW */}
      <Dialog.Root
        open={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] animate-in fade-in duration-300" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[440px] bg-[#0d0d0d]/95 border border-white/[0.08] rounded-2xl shadow-3xl z-[70] overflow-hidden focus:outline-none backdrop-blur-2xl animate-in zoom-in-95 duration-300">
            <Dialog.Title className="sr-only">
              Select Payment Status
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Choose the current status of this payment transaction.
            </Dialog.Description>

            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#ff4d00]/10 flex items-center justify-center rounded-lg border border-[#ff4d00]/20">
                  <AlertCircle className="w-4 h-4 text-[#ff4d00]" />
                </div>
                <span className="text-sm font-bold text-white tracking-tight">Lifecycle Status</span>
              </div>
              <Dialog.Close asChild>
                <button className="p-2 rounded-lg hover:bg-white/[0.05] text-gray-500 hover:text-gray-300 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-2">
                Select current lifecycle state:
              </p>

              <div className="space-y-2.5 max-h-[450px] overflow-y-auto custom-scrollbar pr-1">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        status: status.value,
                      });
                      setIsStatusModalOpen(false);
                    }}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 text-left group backdrop-blur-sm ${formData.status === status.value
                        ? `${status.bgColor.replace('/10', '/5')} ${status.borderColor.replace('/30', '/20')} ring-1 ring-[#ff4d00]/20`
                        : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.04]'
                      }`}
                  >
                    <div className={`mt-0.5 p-2 rounded-lg bg-white/[0.03] transition-transform duration-300 group-hover:scale-110 ${status.color}`}>
                      {status.icon}
                    </div>
                    <div className="flex-1">
                      <div className={`font-bold text-sm tracking-tight ${formData.status === status.value ? status.color : 'text-white'}`}>
                        {status.label}
                      </div>
                      <div className="text-gray-500 text-[10px] mt-1 uppercase font-medium tracking-wide">
                        {status.description}
                      </div>
                    </div>
                    {formData.status === status.value && (
                      <Check className={`w-4 h-4 ${status.color} mt-1`} />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-3 border-t border-white/[0.06] mt-4">
                <Dialog.Close asChild>
                  <button className="px-6 py-2.5 text-gray-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">
                    Close
                  </button>
                </Dialog.Close>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};