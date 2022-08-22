import { styled, run, css } from "uebersicht";
export const refreshFrequency = 1000;

// Cofiguration
export const config = {
    Styling: {
        // Orientation
        horizontal: true,
        // Styling for the main body of the widget
        Root: {
            backgroundColor: "#15121cc7",
            borderRadius: "66px",
            padding: "22px",
            center: true,
            left: "0",
            right: "0",
            bottom: "0",
            top: "0",
        },
        // Styling for the image
        Image: {
            enabled: false,
            width: "auto",
            height: "200px",
            borderRadius: "40px",
            opacity: "1",
        },
        // Styling for the buttons
        Buttons: {
            backgroundColor: "#15121a",
            accentColor: "#D56140c7",
            borderRadius: "80px",
            fontSize: "20px",
            fontWeight: "500",
            padding: "10px",
            height: "65px",
            width: "65px",
            color: "#fff",
        },
    },
};

// Compontnt definitions
const Wrapper = styled("div")`
    position: absolute;
    display: flex;
    background: ${config.Styling.Root.backgroundColor};
    border-radius: ${config.Styling.Root.borderRadius};
    padding: ${config.Styling.Root.padding};
    position: relative;
    gap: ${config.Styling.Root.padding};

    ${config.Styling.horizontal &&
    `
        flex-direction: column;
    `}
`;

const Button = styled("div")`
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    background: ${config.Styling.Buttons.backgroundColor};
    border-radius: ${config.Styling.Buttons.borderRadius};
    font-size: ${config.Styling.Buttons.fontSize};
    padding: ${config.Styling.Buttons.padding};
    height: ${config.Styling.Buttons.height};
    width: ${config.Styling.Buttons.width};
    color: ${config.Styling.Buttons.color};
    font-weight: ${config.Styling.Buttons.fontWeight};
    transition: all 0.1s ease;

    &:hover {
        background: ${config.Styling.Buttons.accentColor};
    }

    &.interactive {
        cursor: pointer;
    }
`;

const Image = styled("img")`
    width: ${config.Styling.Image.width};
    height: ${config.Styling.horizontal ? config.Styling.Image.height : "auto"};
    border-radius: ${config.Styling.Image.borderRadius};
    object-fit: cover;
    opacity: ${config.Styling.Image.opacity};
    user-select: none;
    pointer-events: none;
`;

const Buttons = styled("div")`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    ${!config.Styling.horizontal &&
    `
        flex-direction: column;
    `}$
`;

export const className = `
    display: flex;
    width: 100%;
    height: 100%;
    font-family: "SF Pro Display";
    top: ${config.Styling.Root.top};
    left: ${config.Styling.Root.left};
    right: ${config.Styling.Root.right};
    bottom: ${config.Styling.Root.bottom};
    ${
        config.Styling.Root.center
            ? `
    justify-content: center;
    align-items: center;`
            : ""
    }
`;

// State Managment
export const initialState = { shutdown: "􀆨", restart: "􀅈", batt: "􀛨", date: `${new Date().getDate()}/${new Date().getMonth() + 1}`, finder: "􀈖", sleep: "􀥦" };

export const init = (dispatch) => {
    run("pmset -g batt | egrep -o '[0-9]+%'").then((batt) => {
        dispatch({
            type: "BATTERY_UPDATE",
            data: parseInt(batt.replace("%", "")),
        });
    });
};

export const updateState = (event, previousState) => {
    switch (event.type) {
        case "BATTERY_UPDATE":
            let icon;

            if (event.data <= 25) {
                icon = "􀛩";
            } else if (event.data <= 50) {
                icon = "􀺶";
            } else if (event.data <= 75) {
                icon = "􀺸";
            } else if (event.data <= 100) {
                icon = "􀛨";
            } else {
                icon = "􀛪";
            }

            return { ...previousState, batt: icon, bp: event.data };
            break;
    }
};

export const render = ({ batt, date, finder, sleep, shutdown, restart }) => {
    run("pmset -g batt | grep AC &> 'e'").then((batt) => {
        console.log(batt);
    });

    return (
        <Wrapper>
            {config.Styling.Image.enabled && <Image src="/lumin/images/main.png" />}
            <Buttons>
                <Button>{batt}</Button>
                <Button>{date}</Button>
                <Button
                    className="interactive"
                    onClick={() => {
                        run("open /System/Library/CoreServices/Finder.app");
                    }}
                >
                    {finder}
                </Button>
                <Button
                    className="interactive"
                    onClick={() => {
                        run("pmset sleepnow");
                    }}
                >
                    {sleep}
                </Button>
                <Button
                    className="interactive"
                    onClick={() => {
                        run("osascript -e 'tell app \"loginwindow\" to «event aevtrrst»'");
                    }}
                >
                    {restart}
                </Button>
                <Button
                    className="interactive"
                    onClick={() => {
                        run("osascript -e 'tell app \"loginwindow\" to «event aevtrsdn»'");
                    }}
                >
                    {shutdown}
                </Button>
                {/* you can add or remove <Button>s here */}
            </Buttons>
        </Wrapper>
    );
};
