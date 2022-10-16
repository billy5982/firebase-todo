import List from "./List/List";

export default function DoPanel({ title, data }) {
  return (
    <div className="w-full mt-3 h-5/6 p-1">
      <h5 className="font-bold">{title}</h5>
      <div className="overflow-auto h-[600px] p-2">
        {data.length > 0 &&
          data.map((doing, idx) => <List item={doing} key={idx} />)}
      </div>
    </div>
  );
}
