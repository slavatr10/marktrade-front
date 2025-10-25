import NoAccessIcon from "../../assets/images/NoAccessIcon.svg";

export const AccessModal: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded shadow-md">
      <img src={NoAccessIcon} alt="No Access Icon" className="mb-4" />
      <h3 className="text-lg font-semibold mb-2">У вас немає доступу</h3>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => window.open("https://t.me/SashaProTrade", "_blank")}
      >
        Отримати доступ
      </button>
    </div>
  );
};
