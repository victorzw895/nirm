import { fireEvent, render } from "@solidjs/testing-library";
import Preview, { setSelectedAnime, PreviewProps } from "./Preview";
import { Anime } from '../api';

const previewProps: PreviewProps = {
  animeWatched: () => {},
  nextAnime: () => {},
};

const selectedAnime = {
  id: 2,
  attributes: {
      description: 'description text',
      titles: {
        'en': 'en title',
        'en_jp': 'en jap title',
      },
      startDate: '2020',
      endDate: '2020',
      posterImage: {
        small: 'small-image-source-url',
      },
      ageRatingGuide: 'age rating guide',
  },
  rank: null,
  stars: 0,
  isWatched: false,
  seasonYear: 2011,
  watchlist: false,
} as Partial<Anime>

describe("<Preview />", () => {
  describe("Unwatched Anime Preview", () => {
    beforeEach(() => {
      setSelectedAnime(selectedAnime);
    })
  
    it("Displays Preview Text Content", () => {
      const { getByTestId, unmount } = render(() => <Preview {...previewProps} />);
      const textContents = getByTestId("text-content").querySelectorAll('p');
      expect(textContents[0]).toHaveTextContent(/en jap title/);
      expect(textContents[1]).toHaveTextContent(/en title/);
      expect(textContents[2]).toHaveTextContent(/age rating guide/);
      expect(textContents[3]).toHaveTextContent(/2020/);
      unmount();
    });
  
    it("Displays Preview Image Content", () => {
      const { getByTestId, unmount } = render(() => <Preview {...previewProps} />);
      const poster = getByTestId("poster")
      expect(poster).toHaveAttribute('src', 'small-image-source-url');
      unmount();
    });
  
    it("Displays Preview Description Content", () => {
      const { getByTestId, unmount } = render(() => <Preview {...previewProps} />);
      const description = getByTestId("description")
      expect(description).toHaveTextContent(selectedAnime.attributes.description);
      unmount();
    });
  
    it("Displays Preview Watched Button", () => {
      const { getByTestId, unmount } = render(() => <Preview {...previewProps} />);
      const watchedButton = getByTestId("watched-button");
      expect(watchedButton).toBeInTheDocument();
      expect(watchedButton).toHaveClass('bg-dark');
      unmount();
    });

    it("Displays Preview Next Button", () => {
      const { getByTestId, unmount } = render(() => <Preview {...previewProps} />);
      const nextButton = getByTestId("next-button");
      expect(nextButton).toBeInTheDocument();
      unmount();
    });
  })

  it("Displays Preview Watched Button - greyed out if watched", () => {
    setSelectedAnime({...selectedAnime, isWatched: true});
    const { getByTestId, unmount } = render(() => <Preview {...previewProps} />);
    const watchedButton = getByTestId("watched-button");
    expect(watchedButton).toBeInTheDocument();
    expect(watchedButton).toHaveClass('bg-light text-darkest');
    unmount();
  });

  it("Adds Preview Anime to watched list", () => {
    const animeWatchedMock = vi.fn();
    const { getByTestId, unmount } = render(() => <Preview {...{...previewProps, animeWatched: animeWatchedMock}} />);
    const watchedButton = getByTestId("watched-button");
    fireEvent.click(watchedButton);
    expect(animeWatchedMock).toHaveBeenCalledTimes(1);
    unmount();
  })

  it("Displays Next Preview Anime, when clicking next", () => {
    const nextAnimeMock = vi.fn();
    const { getByTestId, unmount } = render(() => <Preview {...{...previewProps, nextAnime: nextAnimeMock}} />);
    const nextButton = getByTestId("next-button");
    fireEvent.click(nextButton);
    expect(nextAnimeMock).toHaveBeenCalledTimes(1);
    unmount();
  })

  it("renders Preview", () => {
    const { container, unmount } = render(() => <Preview {...previewProps} />);
    expect(container).toMatchSnapshot();
    unmount();
  });
});