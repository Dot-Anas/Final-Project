import React from "react";

function TaskForm({
  addTask,
  newTask,
  setNewTask,
  deadline,
  setDeadline,
  assignedTo,
  setAssignedTo,
  users,
  userRole,
}) {
  return (
    <form
      onSubmit={addTask}
      // قللنا البادينج في الموبايل وضبطنا البوردر عشان ما يخنق الشاشة
      className={`bg-white p-5 md:p-8 rounded-3xl md:rounded-[40px] shadow-xl mb-8 md:mb-12 border-t-[8px] md:border-t-[12px] ${userRole === "admin" ? "border-emerald-500" : "border-blue-500"}`}
    >
      <div className="flex flex-col gap-4 md:gap-5">
        <input
          type="text"
          // صغرنا الخط والبادينج شوي للموبايل
          className="w-full p-4 md:p-5 rounded-2xl border-none bg-slate-100 focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none text-lg md:text-xl font-bold transition-all"
          placeholder={
            userRole === "admin"
              ? "ما هو التكليف الجديد؟"
              : "أضف مهمة لنفسك..."
          }
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          required
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] md:text-xs font-black text-slate-400 mr-2 uppercase">
              موعد التسليم
            </label>
            <input
              type="date"
              className="w-full p-3 md:p-4 rounded-2xl border-none bg-slate-100 font-bold outline-none"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          
          {userRole === "admin" ? (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] md:text-xs font-black text-slate-400 mr-2 uppercase">
                الموظف المسؤول
              </label>
              <select
                className="w-full p-3 md:p-4 rounded-2xl border-none bg-slate-100 font-bold outline-none cursor-pointer"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.username}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center p-3 md:p-4 bg-blue-50 rounded-2xl text-blue-600 text-[10px] md:text-xs font-black border border-blue-100 h-full">
              💡 المهام المضافة هنا تظهر لك وحدك
            </div>
          )}
        </div>
        
        <button
          type="submit"
          className={`w-full py-4 md:py-5 rounded-2xl font-black text-white text-base md:text-lg shadow-xl transition-all active:scale-95 mt-2 ${userRole === "admin" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"}`}
        >
          تأكيد الإضافة
        </button>
      </div>
    </form>
  );
}

export default TaskForm;