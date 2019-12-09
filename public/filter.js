document.addEventListener("DOMContentLoaded", () => {

    const colorTemplate = document.querySelector('.colorTemplate')
    const makeTemplate = document.querySelector('.makeTemplate')
    const carsTemplate = document.querySelector('.carsTemplate')

    const makeListTemplate = Handlebars.compile(makeTemplate.innerHTML);
    const colorListTemplate = Handlebars.compile(colorTemplate.innerHTML);
    const carsTemplateInstance = Handlebars.compile(carsTemplate.innerHTML)

    const colorTemplateInsertPoint = document.querySelector('.colorTemplateInsertPoint')
    const makeTemplateInsertPoint = document.querySelector('.makeTemplateInsertPoint')
    const carsTemplateInsertPoint = document.querySelector('.carsTemplateInsertPoint')
    const filterBtn = document.querySelector('.filterBtn')

    const colorSelect = document.querySelector('.colorSelect')
    const makeSelect = document.querySelector('.makeSelect')
    const allBtn = document.querySelector('.allBtn')

    const showFavoritesBtn = document.querySelector('.showFavoritesBtn')
    const storeFavoritesBtn = document.querySelector('.storeFavoritesBtn')

    const errorTemplateInsertPoint = document.querySelector('.errorTemplateInsertPoint')
    const errorTemplate = document.querySelector('.errorTemplate')
    const errorTemplateInstance = Handlebars.compile(errorTemplate.innerHTML)

    //const dynamicDiv = document.querySelector(".dynamic")

    // storeFavoritesBtn.



    // dynamicDiv.addEventListener("click", (evt) => {

    //     const selected = Array.from(document.querySelectorAll(".carFavorite:checked"));
    //     selectedFavorites = selected.map(e => e.value)
    //     console.log(selectedFavorites)
    //     axios.post('/api/store_favorites', {
    //         data: selectedFavorites
    //     })
    // })

    


    // showFavoritesBtn.addEventListener("click", () => {



    //          axios.get('/api/favorites')
    //         .then(function (res) {
    //             var favorites = res.data.map((entry) => {
    //                 return entry.favorites;
    //             })
    //             axios.get('http://api-tutor.herokuapp.com/v1/cars')
    //                 .then(function (res) {
    //                     let cars = res.data
    //                     let result = cars.filter((car) => favorites.includes(car.reg_number));
    //                     carsTemplateInsertPoint.innerHTML = carsTemplateInstance({
    //                         car: result
    //                     })
    //                 });
    //         });
    // });








    axios.get('http://api-tutor.herokuapp.com/v1/colors')
        .then(function (res) {
            // handle success
            //console.log(res.data)
            let colors = res.data
            colors.unshift("Select Color");
            const colorsHtml = colorListTemplate({
                color: colors
            });

            colorTemplateInsertPoint.innerHTML = colorsHtml

        });

    axios.get('http://api-tutor.herokuapp.com/v1/makes')
        .then(function (res) {
            let makes = res.data
            // console.log(makes)
            makes.unshift("Select Make");
            const makesHtml = makeListTemplate({
                make: makes
            });
            makeTemplateInsertPoint.innerHTML = makesHtml
        });


    axios.get('http://api-tutor.herokuapp.com/v1/cars')
        .then(function (res) {
            let cars = res.data
            carsTemplateInsertPoint.innerHTML = carsTemplateInstance({
                car: cars
            })
        });

    allBtn.addEventListener('click', () => {
        if ("geolocation" in navigator) {
            console.log("yes")
          } else {
            console.log("no")
    
          }
        carsTemplateInsertPoint.innerHTML = ""
        axios.get('http://api-tutor.herokuapp.com/v1/cars')
            .then(function (res) {
                let cars = res.data
                carsTemplateInsertPoint.innerHTML = carsTemplateInstance({
                    car: cars
                })
            });

    })

    filterBtn.addEventListener('click', () => {
        let color = colorSelect.value
        let make = makeSelect.value
        carsTemplateInsertPoint.innerHTML = ""

        if (color && make == "Select Make") {
            axios.get('http://api-tutor.herokuapp.com/v1/cars/color/' + color)
                .then(function (res) {
                    let selectedColorCars = res.data
                    carsTemplateInsertPoint.innerHTML = carsTemplateInstance({
                        car: selectedColorCars
                    });

                });
        } else if (make && color == "Select Color") {
            carsTemplateInsertPoint.innerHTML = ""
            axios.get('http://api-tutor.herokuapp.com/v1/cars/make/' + make)
                .then(function (res) {
                    let selectedColorMakes = res.data
                    carsTemplateInsertPoint.innerHTML = carsTemplateInstance({
                        car: selectedColorMakes
                    });
                });
        } else if (color !== "Select Color" && make !== "Select Make") {
            carsTemplateInsertPoint.innerHTML = ""
            axios.get('http://api-tutor.herokuapp.com/v1/cars/make/' + make + '/color/' + color)
                .then(function (res) {
                    let selectedColorAndMake = res.data
                    carsTemplateInsertPoint.innerHTML = carsTemplateInstance({
                        car: selectedColorAndMake
                    });
                });
        }
    });

})