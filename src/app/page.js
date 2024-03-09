import Card from "@/components/card/Card";  
export default function Home() {
  return (
    <div className="container mx-auto h-full">
      <div className="flex flex-wrap justify-between items-center h-full">
        <div className="mobileDevice">
          <div class="screen">
            <Card className="h-full w-full" />
          </div>
        </div>
        <div className="form">
          <h2> كارت معايدة </h2>
          <div>
            <h4> أكتب اسمك هنا </h4>
            <div class="mb-3">
              <label for="" class="form-label">
                اكتب اسمك هنا{" "}
              </label>
              <input
                type="text"
                class="form-control"
                name=""
                id=""
                aria-describedby="helpId"
                placeholder=""
              />
              <small id="helpId" class="form-text text-muted">
                Help text
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
