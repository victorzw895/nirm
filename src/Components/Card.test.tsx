import { fireEvent, render } from "@solidjs/testing-library";
import Card from "./Card";

const cardProps = {
  id: 0,
  selectAnime: () => {},
  japName: 'jap-name-text',
  engName: 'eng-name-text',
  poster: 'poster-url',
  rank: null,
  stars: null,
};

describe("<Card />", () => {
  it("Displays Jap name", () => {
    const { getByTestId, unmount } = render(() => <Card {...cardProps} />);
    const japName = getByTestId("jap-name");
    expect(japName).toBeInTheDocument();
    expect(japName).toHaveTextContent(/jap-name-text/);
    unmount();
  });

  it("Displays Eng name", () => {
    const { getByTestId, unmount } = render(() => <Card {...cardProps} />);
    const engName = getByTestId("eng-name");
    expect(engName).toBeInTheDocument();
    expect(engName).toHaveTextContent(/eng-name-text/);
    unmount();
  });

  it("Does not displays Rank and stars if rank is null", () => {
    const { queryByTestId, unmount } = render(() => <Card {...cardProps} />);
    const rank = queryByTestId("rank");
    const stars = queryByTestId("stars");
    expect(rank).not.toBeInTheDocument();
    expect(stars).not.toBeInTheDocument();
    unmount();
  });

  it("Displays Rank and stars if rank is not null", () => {
    const { queryByTestId, unmount } = render(() => <Card {...{...cardProps, rank: 1}} />);
    const rank = queryByTestId("rank");
    const stars = queryByTestId("stars");
    expect(rank).toBeInTheDocument();
    expect(rank).toHaveTextContent(/1/);
    expect(stars).toBeInTheDocument();
    expect(stars).toHaveTextContent(/0/);
    unmount();
  });

  it("Opens a preview of anime Card when clicking Card", () => {
    const onClickMock = vi.fn();
    const { getByTestId, unmount } = render(() => <Card {...{...cardProps, selectAnime: onClickMock}} />);
    const card = getByTestId("card");
    fireEvent.click(card);
    expect(onClickMock).toHaveBeenCalledTimes(1);
    unmount();
  })

  it("renders Card", () => {
    const { container, unmount } = render(() => <Card {...cardProps} />);
    expect(container).toMatchSnapshot();
    unmount();
  });
});