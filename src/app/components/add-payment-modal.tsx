import React, { useRef, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  X,
  Plus,
  User,
  Calendar,
  CreditCard,
  Minus,
  Square,
  Search,
  Play,
  Check,
  Clock,
  AlertCircle,
  XCircle,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import { PaymentRecord } from "./payment-table";

interface PaymentModalProps {
  onSave: (
    payment: Omit<PaymentRecord, "id" | "recordedAt">,
  ) => void;
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

type PaymentStatus = "Completed" | "Pending" | "Failed" | "Processing" | "Cancelled" | "Refunded";

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
];

export const PaymentModal: React.FC<PaymentModalProps> = ({
  onSave,
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
    onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  const [isWorkerModalOpen, setIsWorkerModalOpen] =
    useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] =
    useState(false);
  const [workerSearch, setWorkerSearch] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [formData, setFormData] = useState({
    workerName: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    method: "Cash",
    notes: "",
    status: "Completed" as PaymentStatus,
  });

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

  useEffect(() => {
    if (open && canvasRef.current && !initialData) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [open, initialData]);

  const startDrawing = (
    e: React.MouseEvent | React.TouchEvent,
  ) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x =
      "touches" in e
        ? e.touches[0].clientX - rect.left
        : (e as React.MouseEvent).clientX - rect.left;
    const y =
      "touches" in e
        ? e.touches[0].clientY - rect.top
        : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
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
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let signature: string | undefined = undefined;
    if (canvasRef.current && !initialData) {
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
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px] bg-[#1a1a1a] border border-[#333] rounded-sm shadow-2xl z-50 overflow-hidden focus:outline-none flex flex-col max-h-[95vh]">
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

            {/* Windows-style Title Bar */}
            <div className="flex items-center justify-between bg-[#f0f0f0] px-2 py-1 text-xs text-gray-700 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#ff4d00] flex items-center justify-center rounded-xs">
                  {initialData ? (
                    <Search className="w-3 h-3 text-white" />
                  ) : (
                    <Plus className="w-3 h-3 text-white" />
                  )}
                </div>
                <span>
                  {initialData ? "Edit Payment" : "Add Payment"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-300 transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <button className="p-1 hover:bg-gray-300 transition-colors">
                    <Square className="w-2.5 h-2.5" />
                  </button>
                  <Dialog.Close asChild>
                    <button className="p-1 hover:bg-red-500 hover:text-white transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </Dialog.Close>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <h2 className="text-[#ff4d00] text-sm font-bold uppercase mb-4 tracking-wide">
                {initialData
                  ? "Update Payment Record"
                  : "Record New Payment"}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-3"
              >
                {/* Worker Name Row */}
                <div className="grid grid-cols-[120px_1fr_auto] items-center gap-3">
                  <label className="text-gray-400 text-sm">
                    Worker Name:
                  </label>
                  <input
                    type="text"
                    placeholder="Type name or use 'Select Worker'"
                    className="bg-[#242424] border border-[#333] px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-[#ff4d00] rounded-sm w-full"
                    value={formData.workerName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        workerName: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsWorkerModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-1.5 bg-[#333] hover:bg-[#444] text-gray-200 rounded-sm text-sm border border-[#444] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Select Worker</span>
                  </button>
                </div>

                {/* Amount Row */}
                <div className="grid grid-cols-[120px_1fr] items-center gap-3">
                  <label className="text-gray-400 text-sm">
                    Amount:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="$0.00"
                      className="bg-[#242424] border border-[#333] px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-[#ff4d00] rounded-sm w-full"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amount: e.target.value,
                        })
                      }
                      required
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col -gap-1">
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-300 text-[10px]"
                      >
                        ▴
                      </button>
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-300 text-[10px]"
                      >
                        ▾
                      </button>
                    </div>
                  </div>
                </div>

                {/* Payment Date Row */}
                <div className="grid grid-cols-[120px_1fr] items-center gap-3">
                  <label className="text-gray-400 text-sm">
                    Payment Date:
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className="bg-[#242424] border border-[#333] px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-[#ff4d00] rounded-sm w-full appearance-none"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          date: e.target.value,
                        })
                      }
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <button type="button">▾</button>
                    </div>
                  </div>
                </div>

                {/* Payment Method Row */}
                <div className="grid grid-cols-[120px_1fr] items-center gap-3">
                  <label className="text-gray-400 text-sm">
                    Payment Method:
                  </label>
                  <div className="relative">
                    <select
                      className="bg-[#242424] border border-[#333] px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-[#ff4d00] rounded-sm w-full appearance-none"
                      value={formData.method}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          method: e.target.value,
                        })
                      }
                    >
                      <option value="Cash">Cash</option>
                      <option value="Check">Check</option>
                      <option value="Bank Transfer">
                        Bank Transfer
                      </option>
                      <option value="Mobile Money">
                        Mobile Money
                      </option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <button type="button">▾</button>
                    </div>
                  </div>
                </div>

                {/* Payment Status Row - NEW FEATURE */}
                <div className="grid grid-cols-[120px_1fr_auto] items-center gap-3">
                  <label className="text-gray-400 text-sm">
                    Status:
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsStatusModalOpen(true)}
                    className={`flex items-center gap-3 px-3 py-1.5 rounded-sm border transition-all duration-200 w-full text-left ${currentStatus.bgColor} ${currentStatus.borderColor} hover:opacity-80`}
                  >
                    <span className={currentStatus.color}>
                      {currentStatus.icon}
                    </span>
                    <span className={`text-sm font-medium ${currentStatus.color}`}>
                      {currentStatus.label}
                    </span>
                    <span className="text-gray-500 text-xs ml-auto">
                      {currentStatus.description}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsStatusModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-1.5 bg-[#333] hover:bg-[#444] text-gray-200 rounded-sm text-sm border border-[#444] transition-colors"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Change Status</span>
                  </button>
                </div>

                {/* Notes */}
                <div className="space-y-1.5 mt-2">
                  <label className="text-gray-400 text-sm font-bold">
                    Notes:
                  </label>
                  <textarea
                    placeholder="Enter any additional notes..."
                    className="w-full bg-[#242424] border border-[#333] p-3 text-sm text-gray-300 focus:outline-none focus:border-[#ff4d00] rounded-sm min-h-[60px] resize-none"
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
                  <div className="space-y-2 mt-2">
                    <label className="text-gray-200 text-sm font-bold">
                      Worker Signature:
                    </label>
                    <div className="bg-white rounded-sm overflow-hidden h-[120px] relative">
                      <canvas
                        ref={canvasRef}
                        width={652}
                        height={120}
                        className="w-full h-full cursor-crosshair touch-none"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="w-full bg-[#333] hover:bg-[#3d3d3d] text-white font-bold py-2 rounded-md transition-colors text-xs"
                    >
                      Clear Signature
                    </button>
                  </div>
                )}

                <div className="pt-4 flex justify-between items-center sticky bottom-0 bg-[#1a1a1a] pb-2">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="bg-[#333] hover:bg-[#3d3d3d] text-white font-bold py-2 px-8 rounded-md transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    className="bg-[#ff4d00] hover:bg-[#ff5d14] text-white font-bold py-2 px-8 rounded-md transition-all active:scale-[0.98] text-sm shadow-lg shadow-[#ff4d00]/20"
                  >
                    {initialData
                      ? "Update Payment"
                      : "Save Payment"}
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
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[60]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] bg-[#1a1a1a] border border-[#333] rounded-sm shadow-2xl z-[70] overflow-hidden focus:outline-none">
            <Dialog.Title className="sr-only">
              Select Worker
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Choose a worker from the list to populate the
              payment form.
            </Dialog.Description>

            <div className="flex items-center justify-between bg-[#f0f0f0] px-2 py-1 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-gray-500" />
                <span>Select Worker</span>
              </div>
              <Dialog.Close asChild>
                <button className="p-1 hover:bg-red-500 hover:text-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </Dialog.Close>
            </div>

            <div className="p-4 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search workers..."
                  className="w-full bg-[#242424] border border-[#333] pl-9 pr-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-[#ff4d00] rounded-sm"
                  value={workerSearch}
                  onChange={(e) =>
                    setWorkerSearch(e.target.value)
                  }
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>

              <div className="max-h-[300px] overflow-y-auto border border-[#333] rounded-sm bg-[#121212] custom-scrollbar">
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
                      className="w-full flex items-center justify-between px-4 py-3 text-left text-sm text-gray-300 hover:bg-[#ff4d00] hover:text-white transition-colors group border-b border-[#333] last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#333] rounded-full flex items-center justify-center text-[10px] font-bold group-hover:bg-white/20">
                          {worker
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span>{worker}</span>
                      </div>
                      {formData.workerName === worker && (
                        <Check className="w-4 h-4 text-[#ff4d00] group-hover:text-white" />
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
                  <button className="px-6 py-2 bg-[#333] hover:bg-[#444] text-white text-xs font-bold rounded-sm transition-colors">
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
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[60]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] bg-[#1a1a1a] border border-[#333] rounded-sm shadow-2xl z-[70] overflow-hidden focus:outline-none">
            <Dialog.Title className="sr-only">
              Select Payment Status
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Choose the current status of this payment transaction.
            </Dialog.Description>

            <div className="flex items-center justify-between bg-[#f0f0f0] px-2 py-1 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-gray-500" />
                <span>Select Payment Status</span>
              </div>
              <Dialog.Close asChild>
                <button className="p-1 hover:bg-red-500 hover:text-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </Dialog.Close>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-gray-500 text-xs mb-3">
                Select the current state of this payment transaction:
              </p>

              <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
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
                    className={`w-full flex items-start gap-3 p-3 rounded-sm border transition-all duration-200 text-left group ${formData.status === status.value
                        ? `${status.bgColor} ${status.borderColor} ring-1 ${status.color.replace('text-', 'ring-')}`
                        : 'bg-[#242424] border-[#333] hover:border-[#444] hover:bg-[#2a2a2a]'
                      }`}
                  >
                    <div className={`mt-0.5 ${status.color}`}>
                      {status.icon}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${formData.status === status.value ? status.color : 'text-gray-200'}`}>
                        {status.label}
                      </div>
                      <div className="text-gray-500 text-xs mt-0.5">
                        {status.description}
                      </div>
                    </div>
                    {formData.status === status.value && (
                      <Check className={`w-4 h-4 ${status.color} mt-0.5`} />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-3 border-t border-[#333] mt-3">
                <Dialog.Close asChild>
                  <button className="px-6 py-2 bg-[#333] hover:bg-[#444] text-white text-xs font-bold rounded-sm transition-colors">
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