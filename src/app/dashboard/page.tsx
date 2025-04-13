       router.push(
         `/results?html=${encodeURIComponent(result.html)}&css=${encodeURIComponent(
           result.css
         )}&font=${encodeURIComponent(font)}&primaryColor=${encodeURIComponent(primaryColor)}&javascript=${encodeURIComponent(result.javascript || '')}`
       );