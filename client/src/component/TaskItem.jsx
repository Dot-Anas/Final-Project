import React from "react";

function TaskItem({
  task,
  userRole,
  userId,
  toggleTaskStatus,
  deleteTask,
  commentText,
  setCommentText,
  addComment,
}) {
  return (
    <div className="bg-white rounded-[35px] shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-xl">
      <div className="p-8 flex justify-between items-start gap-4">
        <div className="flex gap-5">
          <button
            onClick={() => toggleTaskStatus(task._id, task.status)}
            className={`mt-1 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${task.status === "Done" ? "bg-emerald-500 border-emerald-500 text-white shadow-lg" : "border-slate-200 text-transparent hover:border-emerald-500"}`}
          >
            ✓
          </button>
          <div>
            <div className="flex gap-2 mb-2">
              {task.createdBy?._id === task.assignedTo?._id ? (
                <span className="bg-blue-100 text-blue-600 text-[9px] px-2 py-0.5 rounded-full font-black">
                  📍 مهمة شخصية
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-600 text-[9px] px-2 py-0.5 rounded-full font-black">
                  🏢 تكليف إداري
                </span>
              )}
            </div>
            <h3
              className={`text-2xl break-all font-black wrap-break-word overflow-hidden max-w-full ${task.status === "Done" ? "line-through text-slate-300" : "text-slate-700"}`}
            >
              {task.title}
            </h3>{" "}
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-3 py-1 rounded-lg uppercase">
                👤 {task.assignedTo?.username}
              </span>
              {task.deadline && (
                <span
                  className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase ${new Date(task.deadline) < new Date() && task.status !== "Done" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}
                >
                  📅{" "}
                  {new Date(task.deadline).toLocaleDateString("ar-EG")}
                </span>
              )}
            </div>
          </div>
        </div>

        {(userRole === "admin" || task.createdBy?._id === userId) && (
          <button
            onClick={() => deleteTask(task._id)}
            className="text-slate-200 hover:text-red-500 p-2 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="bg-slate-50 p-6 border-t border-slate-100">
        <p className="text-[10px] font-black text-slate-400 mb-4 px-2 uppercase tracking-widest">
          النقاش المباشر 💬
        </p>
        <div className="space-y-3 mb-5 max-h-52 overflow-y-auto px-2">
          {task.comments?.length > 0 ? (
            task.comments.map((c, i) => (
              <div
                key={i}
                className={`flex flex-col p-3 rounded-2xl max-w-[80%] shadow-sm border ${c.user?._id === userId ? "bg-emerald-50 border-emerald-100 mr-auto" : "bg-white border-slate-100 ml-auto text-right"}`}
              >
                <span className="text-[9px] font-black text-slate-400 mb-1">
                  {c.user?.username}
                </span>
                <p className="text-sm font-bold text-slate-700">
                  {c.text}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-[10px] text-slate-300 py-4 italic">
              لا يوجد نقاشات بعد..
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="اكتب شيئاً..."
            className="flex-1 p-4 rounded-2xl border-none bg-white shadow-inner outline-none text-sm font-medium"
            value={commentText[task._id] || ""}
            onChange={(e) =>
              setCommentText((prev) => ({
                ...prev,
                [task._id]: e.target.value,
              }))
            }
          />
          <button
            onClick={() => addComment(task._id)}
            className="bg-slate-900 text-white px-6 rounded-2xl text-xs font-black hover:bg-black transition-all"
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;