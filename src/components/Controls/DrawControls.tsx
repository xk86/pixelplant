import { ChangeEvent } from "react";
import { DrawControlProps } from "../../types/DrawControls";

export function DrawControls({ settings, setFn, dispatch }: DrawControlProps) {
  let localSettings = { ...settings };

  const handleFormChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    console.log(508, event.target.value);
    if (index > 1) {
      dispatch({ type: "reset" });
      localSettings = { ...localSettings, [event.target.name]: parseInt(event.target.value) };
    } else {
      localSettings = { ...localSettings, [event.target.name]: parseInt(event.target.value) };
    }
    setFn({ ...settings, [event.target.name]: parseInt(event.target.value) });

    //  console.log(509,setFn({...settings, [event.target.name]: settings[event.target.name]}));
    //   console.log(510,settings)
  };
  const submit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };

  return (
    <div className="drawControls">
      <form onSubmit={submit}>
        <h3>Draw Settings</h3>
        {Object.keys(settings).map((input, index) => {
          return (
            <div key={index} className="drawSettings">
              {input}:
              <input
                name={input}
                placeholder={input}
                type="number"
                value={settings[input]}
                onChange={(event) => handleFormChange(index, event)}
              />
              <br />
            </div>
          );
        })}
      </form>
    </div>
  );
}
