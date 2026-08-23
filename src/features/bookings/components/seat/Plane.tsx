export const Plane = () => {
  return (
    <div className="plane relative">
      <div className="head bg-gray-200 px-3 [clip-path:ellipse(50%_100%_at_50%_100%)]">
        <div className="head-plane h-100 w-120 bg-white [clip-path:ellipse(50%_100%_at_50%_100%)]"></div>
      </div>
      <div className="cabine bg-gray-200 px-3">
        <div className="cabine-plane h-350 w-120 bg-white p-1">
          <div className="service flex flex-row justify-between">
            <div className="toils w-[42%] rounded-lg border border-dashed border-[#b7b8c2] px-3 py-2 text-center">
              <span className="material-symbols-outlined text-[32px]! text-[#b7b8c2]">wc</span>
            </div>
            <div className="air-hostess w-[42%] rounded-lg border border-dashed border-[#b7b8c2] px-3 py-2 text-center">
              <span className="material-symbols-outlined text-[32px]! text-[#b7b8c2]">coffee</span>
            </div>
          </div>

          <div className="separator flex flex-row items-center">
            <hr className="w-full border-2 border-[#b7b8c2]" />
            <div className="flex max-h-10 max-w-10 items-center justify-center rounded-lg bg-[#b7b8c2] p-3">
              <span className="material-symbols-outlined text-3xl! text-white">
                directions_walk
              </span>
            </div>
            <hr className="w-full border-2 border-[#b7b8c2]" />
          </div>

          <div className="rows flex flex-row justify-between">
            <div className="rows-1 grid h-16 w-[42%] grid-cols-3 items-center text-center font-medium text-[#636680]">
              <div className="p-5">
                <h4>A</h4>
              </div>
              <div className="p-5">
                <h4>B</h4>
              </div>
              <div className="p-5">
                <h4>C</h4>
              </div>
            </div>
            <div className="rows-2 grid h-16 w-[42%] grid-cols-3 items-center text-center font-medium text-[#636680]">
              <div className="p-5">
                <h4>D</h4>
              </div>
              <div className="p-5">
                <h4>E</h4>
              </div>
              <div className="p-5">
                <h4>F</h4>
              </div>
            </div>
          </div>

          <div className="separator-seats flex w-full flex-col items-center gap-6">
            <div className="separator-text flex w-full flex-col items-center">
              <div className="separator flex w-full flex-row items-center">
                <hr className="w-full border border-blue-400" />
                <div className="flex items-center justify-center gap-2 rounded-lg p-3">
                  <h5 className="font-semibold text-blue-400">Adelante</h5>
                  <h5 className="text-[16px] font-bold text-black">$30.697</h5>
                </div>
                <hr className="w-full border border-blue-400" />
              </div>

              <div className="text -my-3">
                <h6 className="text-[14px] text-[#636680]">Bajás primero del avión</h6>
              </div>
            </div>

            <div className="flex w-full flex-col gap-4">
              <div className="seats-with-column grid w-full grid-cols-7">
                <div className="h-16 w-16 rounded-lg border-3 border-blue-400 hover:bg-blue-400/40"></div>
                <div className="h-16 w-16 rounded-lg border-3 border-blue-400 hover:bg-blue-400/40"></div>
                <div className="h-16 w-16 rounded-lg border-3 border-blue-400 hover:bg-blue-400/40"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-lg">
                  <h4 className="text-[#636680]">1</h4>
                </div>
                <div className="h-16 w-16 rounded-lg border-3 border-blue-400 hover:bg-blue-400/40"></div>
                <div className="h-16 w-16 rounded-lg border-3 border-blue-400 hover:bg-blue-400/40"></div>
                <div className="h-16 w-16 rounded-lg border-3 border-blue-400 hover:bg-blue-400/40"></div>
              </div>
              <div className="seats-with-column grid w-full grid-cols-7">
                <div className="h-16 w-16 rounded-lg border-3 border-blue-400 hover:bg-blue-400/40"></div>
                <div className="h-16 w-16 rounded-lg border-3 border-blue-400 hover:bg-blue-400/40"></div>
                <div className="h-16 w-16 rounded-lg border-3 border-blue-400 hover:bg-blue-400/40"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-lg">
                  <h4 className="text-[#636680]">2</h4>
                </div>
                <div className="h-16 w-16 rounded-lg border-3 border-blue-400 hover:bg-blue-400/40"></div>
                <div className="h-16 w-16 rounded-lg border-3 border-blue-400 hover:bg-blue-400/40"></div>
                <div className="h-16 w-16 rounded-lg border-3 border-blue-400 hover:bg-blue-400/40"></div>
              </div>
              <div className="seats-with-column grid w-full grid-cols-7">
                <div className="h-16 w-16 rounded-lg border-3 border-blue-400 hover:bg-blue-400/40"></div>
                <div className="h-16 w-16 rounded-lg border-3 border-blue-400 hover:bg-blue-400/40"></div>
                <div className="h-16 w-16 rounded-lg border-3 border-blue-400 hover:bg-blue-400/40"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-lg">
                  <h4 className="text-[#636680]">3</h4>
                </div>
                <div className="h-16 w-16 rounded-lg border-3 border-blue-400 hover:bg-blue-400/40"></div>
                <div className="h-16 w-16 rounded-lg border-3 border-blue-400 hover:bg-blue-400/40"></div>
                <div className="h-16 w-16 rounded-lg border-3 border-blue-400 hover:bg-blue-400/40"></div>
              </div>
            </div>
          </div>

          <div className="separator-seats flex w-full flex-col items-center gap-6">
            <div className="separator-text flex w-full flex-col items-center">
              <div className="separator flex w-full flex-row items-center">
                <hr className="border-primary flex-1 border" />
                <div className="flex shrink-0 items-center justify-center gap-2 rounded-lg p-3">
                  <h5 className="text-primary font-semibold">Standard adelante</h5>
                  <h5 className="text-[16px] font-bold text-black">$13.642</h5>
                </div>
                <hr className="border-primary flex-1 border" />
              </div>

              <div className="text -my-3">
                <h6 className="text-[14px] text-[#636680]">¡Buena ubicación a un buen precio!</h6>
              </div>
            </div>

            <div className="flex w-full flex-col gap-4">
              <div className="seats-with-column grid w-full grid-cols-7">
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-lg">
                  <h4 className="text-[#636680]">4</h4>
                </div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
              </div>
              <div className="seats-with-column grid w-full grid-cols-7">
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-lg">
                  <h4 className="text-[#636680]">5</h4>
                </div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
              </div>
              <div className="seats-with-column grid w-full grid-cols-7">
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-lg">
                  <h4 className="text-[#636680]">6</h4>
                </div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
              </div>
              <div className="seats-with-column grid w-full grid-cols-7">
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-lg">
                  <h4 className="text-[#636680]">7</h4>
                </div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
              </div>
              <div className="seats-with-column grid w-full grid-cols-7">
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-lg">
                  <h4 className="text-[#636680]">8</h4>
                </div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
              </div>
              <div className="seats-with-column grid w-full grid-cols-7">
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-lg">
                  <h4 className="text-[#636680]">9</h4>
                </div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
              </div>
              <div className="seats-with-column grid w-full grid-cols-7">
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-lg">
                  <h4 className="text-[#636680]">10</h4>
                </div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
              </div>
              <div className="seats-with-column grid w-full grid-cols-7">
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-lg">
                  <h4 className="text-[#636680]">11</h4>
                </div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
              </div>
              <div className="seats-with-column grid w-full grid-cols-7">
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-lg">
                  <h4 className="text-[#636680]">12</h4>
                </div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
              </div>
              <div className="seats-with-column grid w-full grid-cols-7">
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-lg">
                  <h4 className="text-[#636680]">13</h4>
                </div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
              </div>
              <div className="seats-with-column grid w-full grid-cols-7">
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="flex h-16 w-16 items-center justify-center rounded-lg">
                  <h4 className="text-[#636680]">14</h4>
                </div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
                <div className="border-primary hover:bg-primary/40 h-16 w-16 rounded-lg border-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
