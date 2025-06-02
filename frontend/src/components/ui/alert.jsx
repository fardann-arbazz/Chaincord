import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { LuCircleAlert, LuInfo, LuX } from "react-icons/lu";

const iconMap = {
  success: <FaCheckCircle className="text-green-400 w-6 h-6" />,
  error: <LuCircleAlert className="text-red-400 w-6 h-6" />,
  info: <LuInfo className="text-blue-400 w-6 h-6" />,
};

const AlertToast = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="flex items-start gap-3 w-full max-w-sm p-4 rounded-xl border shadow-lg 
        bg-zinc-900 border-zinc-700 text-white"
      >
        <div>{iconMap[type]}</div>
        <div className="flex-1 text-sm">
          <p className="font-semibold capitalize text-zinc-100">{type}</p>
          <p className="text-zinc-400">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-300 transition"
        >
          <LuX className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertToast;
