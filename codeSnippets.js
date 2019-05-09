/*
function myFunc() { }
opti.wait([".el1", "#el3"], "myFunc", 300) 

opti.select(".myEl")

opti.selectAll(".multipleElements");

opti.addScript("http://www.google.com");

opti.append(".MoveThis", ".ToHere")

opti.prepend(".MoveThis", ".ToHere")

opti.delete(".deleteMe");

Returns search data depending on current site
opti.localStore();

opti.event("OPTI_Event_name")
*/

var opti = {
	wait: function(els, func, time) {
		return function() {
			time = time || 300;
			var optiWait = setInterval(function() {
				if(els.every(function(item) {
					return document.querySelector(item);
				})){
					clearInterval(optiWait);
					clearTimeout(optiTimeout);
					func ? window[func]() : null;
				}
			}, time);
			var optiTimeout = setTimeout(function() {
				clearInterval(optiWait);
			}, 10000);
		}
	},
	select: function(selector) {
		return document.querySelector(selector);
	},
	addScript: function(url) {
		var tag = document.createElement("script");
		tag.src = url;
		document.body.appendChild(tag);
	},
	selectAll: function(selector) {
		return Array.prototype.slice.call(document.querySelectorAll(selector));
    },
	append: function(thing, place) {
		var thingToMove = document.querySelector(thing);
		var placeToMove = document.querySelector(place);
		placeToMove.appendChild(thingToMove);
	},
	prepend: function(thing, place) {
		var thingToMove = document.querySelector(thing);
		var placeToMoveTo = document.querySelector(place);
		placeToMoveTo.insertBefore(thingToMove, placeToMoveTo.firstChild);
	},
	delete: function(selector) {
		var elementToRemove = document.querySelector(selector);
		element.parentNode.removeChild(elementToRemove);
	},
	localStore: function() {
		var currentSite = document.URL;
		var siteCode;
        if (currentSite.indexOf("www.tui.co.uk") !== -1) { siteCode = "th"; }
        else if (currentSite.indexOf("www.firstchoice.co.uk") !== -1) { siteCode = "fc"; }
        else { siteCode = "fj"; }
		return JSON.parse(localStorage.getItem("user-search-data-" + siteCode));
    },
	event: function(eventName) {
		eventName = eventName || "OPTI_Default_event";
		window.optimizationVar = eventName;
		Bootstrapper.ensEvent.trigger("Global Optimization Event");
    },
    checkDate: function(dateToCheck, datesToCompare, whatToCheck) {
        var operators = {
            "equalto": function(a, b) { return a === b },
            "lessthan": function(a, b) { return a < b },
            "greaterthan": function(a, b) { return a > b }
        };
        var check = whatToCheck.toLowerCase();
        var checkDate = new Date(dateToCheck).getTime();
        var sortedDates = datesToCompare.sort(function(a, b){return a - b});
        var compDateOne = new Date(sortedDates[0]).getTime();
        var compDateTwo = sortedDates.length > 1 ? new Date(sortedDates[1]).getTime() : null;
        if (check === "equalto" || check === "greaterthan" || check === "lessthan") {
            return operators[check](checkDate, compDateOne);
        } else if (check === "between") {
            return compDateOne <= checkDate && checkDate <= compDateTwo;
        }
    },
    sortArray: function(array, prop, order) {
        var returnArr = array.sort(function(a, b){ if(prop) {return a[prop] - b[prop]} else {return a - b}});
        if (order === "decending") {
            return returnArr.reverse();
        } else {
            return returnArr;
        }
    },
    compareArray: function(arr1, arr2) {
        return JSON.stringify(arr1) === JSON.stringify(arr2);
    },
    searchResultsData: function() {
        return store.getState().bookflow_searchResultsList.ids;
	},
	debounce: function(func, wait, immediate) {
		var timeout;
		return function () {
			var context = this,	args = arguments;
			var later = function () {
				timeout = null;
				if (!immediate) {
					window[func].apply(context, args);
				}
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) {
				window[func].apply(context, args);
			}
		};
	},
	subscribe: function(func) {
		if (typeof store === "object") {
			var prevRes = opti.searchResultsData();
			var prevSort = JSON.stringify(store.getState().searchResults_filterSortBy);
			store.subscribe(function() {
			var currResults = opti.searchResultsData();
			if (!opti.compareArray(currResults, prevRes)) {
				var currSort = JSON.stringify(store.getState().searchResults_filterSortBy);
				var method = currResults.length > prevRes.length ? "paginated" : prevSort != currSort ? "sorted" : "filtered";
				prevRes = currResults;
				prevSort = currSort;
				prevPaginate = currPaginate;
				opti.storeData(func, method);
			}
		});
		}
	},
	storeData: function(func, method) {
		var optiArr = [];
		var records = store.getState().bookflow_searchResultsList.records;
		for (var optiRecord in records) {
			optiArr.push(records[optiRecord]);
		}
		opti.sortArray(optiArr);
		window[func](optiArr, method)
	},
	cloneObj: function(obj) {
		return JSON.parse(JSON.stringify(obj));
	},
	find: function(stringArr, toFind, caseSensitive) {
		if (!caseSensitive) {
			toFind = toFind.toUpperCase();
			stringArr = typeof stringArr === "string" ? stringArr.toUpperCase() : stringArr.map(function(x){ if (typeof x === "string") { return x.toUpperCase() } else { return x }});
		}
		return stringArr.indexOf(toFind) != -1;
	}
}



/*-----Prepend element before another element-----*/
var placeToMoveTo = document.querySelector("[SELECTOR]");
var itemToMove = document.querySelector("[SELECTOR]");
placeToMoveTo.insertBefore(itemToMove, placeToMoveTo.firstChild);


/*-----Append element after another element-----*/
var placeToMove = document.querySelector("[SELECTOR]");
var thingToMove = document.querySelector("[SELECTOR]");
placeToMove.appendChild(thingToMove);


/*-----Delete element-----*/
var elementToRemove = document.querySelector("[SELECTOR]");
element.parentNode.removeChild(elementToRemove);


/*-----Move element relative to sibling-----*/
/*-----Move element "up":-----*/
if(element.previousElementSibling) {
  element.parentNode.insertBefore(element, element.previousElementSibling);
}
/*-----Move element "down":-----*/
if(element.nextElementSibling) {
  element.parentNode.insertBefore(element.nextElementSibling, element);
}


/*-----Interval to wait for Element-----*/
var myLoop = setInterval(function () {
  var elementToWaitFor = document.querySelector("[SELECTOR]");
  if (elementToWaitFor) {
    clearInterval(myLoop);
  }
}, timeoutInMs);


/*-----Insert Adjacent HTML------*/
document.querySelector("[SELECTOR]").insertAdjacentHTML('[beforebegin, beforeend, afterbegin, afterend]', '[CONTENT]');


/*-----Convert Nodelist to Array-----*/
var myArr = Array.prototype.slice.call(document.querySelectorAll("[SELECTOR]"));


/*-----Loop through Array-----*/
myArr.forEach(function(item, index) {

});
/*-----OR-----*/
myArr.map(function(item, index) {

});


/*-----TUI Local storage-----*/
JSON.parse(localStorage.getItem("user-search-data-th"))


/*-----Click event for Accordion-----*/
document.querySelector("[SELECTOR]").onclick = accordionFunction;

function accordionFunction() {
    this.classList.toggle("minimised");
}


/*-----On click event-----*/
document.querySelector("[SELECTOR]").onclick = clickFunction;

function clickFunction() {
    // Do Something
}


/*-----Event Tracking-----*/
window.optimizationVar = "[OPTI_EVENT NAME]"; // Call this something related to the event
Bootstrapper.ensEvent.trigger("Global Optimization Event"); //Fire the Ensighten event which references the variable (Don't change)


/*-----Check & Set Cookie-----*/
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie(cname, cvalue, exdays) {
    var cruiseCheck = getCookie(cname);
    if (cruiseCheck != cvalue) {
        //Do something HERE
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";";
    }
}
checkCookie("cruiseCheck", "true", 60);

/*-----Debounce function to stop firing events too frequently-----*/
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) {
              func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
          func.apply(context, args);
        }
    };
};


/*-----Sticky Scroll------*/
var stickyEl = document.querySelector("[MY ELEMENT]")
var stickyHeight = stickyEl.getBoundingClientRect().top;

var stickyFn = debounce(function () {
    var cl = document.body.classList;
    window.pageYOffset > stickyHeight ? cl.add("opti-fixed") : cl.remove("opti-fixed");
}, 250);

window.addEventListener('scroll', stickyFn);


/*-----Sticky Option 2-----*/
var stickyEl = document.querySelector("[SELECTOR]");
var stickWait = setInterval(function () {
    if (stickyEl) {
        clearInterval(stickWait);
        var stickyHeight = stickyEl.getBoundingClientRect().top + document.documentElement.scrollTop;

        window.onscroll = function (event) {
            requestAnimationFrame(checkSticky);
        };

        function checkSticky() {
            var pageYOffset = window.pageYOffset + 2;
            var cl = document.body.classList;
            window.pageYOffset > stickyHeight ? cl.add("opti-fixed") : cl.remove("opti-fixed");
        }
    }
}, 300);


/*-----Add Script to page-----*/
var tag = document.createElement("script");
tag.src = "[SCRIPT SOURCE]";
tag.id = "[SCRIPT ID]";
document.getElementsByTagName("body")[0].appendChild(tag);


/*-----Search results data (DOJO)----*/
function optiFn(data) {
    var searchArr = Array.prototype.slice.call(document.querySelectorAll(".results-list > li:not(.bound)"));
    console.log(searchArr);
    console.log(data);
    searchArr.forEach(function (card, index) {
        card.classList.add("bound");
        card.querySelector(".holiday-price").insertAdjacentHTML('afterbegin', '<p>' + data.holidays[index].price.totalParty + '</p>')
    });
};

var jsonD = setInterval(function () {
    var searchEl = document.querySelector(".results-list > li");
    if (typeof jsonData == "object" && (jsonData.searchResult.holidays.length > 0) && searchEl) {
        clearInterval(jsonD);
        optiFn(jsonData.searchResult);
    }
}, 300);

var dijitW = setInterval(function () {
    if (typeof dijit == "object" && typeof dijit.registry == "object" && dijit.registry.byId('searchResultsController')) {
        clearInterval(dijitW);

        function getSearchResponse() {
            var searchResultController = dijit.registry.byId('searchResultsController'),
                resultsView = searchResultController.resultsView,
                refreshResultsView = resultsView.__proto__.refresh;
            resultsView.__proto__.refresh = function (response, options) {
                refreshResultsView.apply(this, arguments);
                optiFn(response);
            }
        }
        getSearchResponse();
    }
}, 300);


/*-----Example XHR request----*/
var productsList = Array.prototype.slice.call(document.querySelectorAll(".m7-products li.product"));
var myProducts = [];
var myCount = 0;
baseURL = "https://www.tui.co.uk";

productsList.forEach(function(products, index) {
   var productURL = baseURL + products.querySelector(".ensLinkTrack").getAttribute("href");
   var productClass =  "." + products.className.replace(" ", ".");
   myProducts[index] = { selector: productClass, url: productURL }
});

function getCount () {
    myCount++;
    if (myCount >= myProducts.length) {
        myProducts.forEach(function(finProduct) {
            finProduct.lowestPrice != null ? document.querySelector(finProduct.selector).querySelector(".product-text").textContent = "From: £" + finProduct.lowestPrice : null;
       });
   }
}

myProducts.forEach(function(product, index) {
   fireReq(product.url, index);
});

function fireReq(url, index) {
   var request = new XMLHttpRequest();
   request.open('GET', url, true);

   request.onload = function() {
   if (request.status >= 200 && request.status < 400) {
        var prodLowestPrice = null;
       var priceArr = [];
       var resp = request.responseText;  
       var parser = new DOMParser();
       var xmlDoc=parser.parseFromString(resp, "text/html");
       var tds = xmlDoc.querySelectorAll(".price-value");
       if (tds.length > 0) {
           for (var i = 0; i < tds.length; i++) {
               priceArr.push(tds[i].innerHTML);
           }
           priceArr.sort(function(a, b) {
               return a - b;
           });
           prodLowestPrice = +priceArr[0];
       }
        myProducts[index].lowestPrice = prodLowestPrice;
        getCount ();
   } else {
        myProducts[index].lowestPrice = null;
        getCount ();
    }
   };
   request.onerror = function() {};
   request.send();
}


/*-----Get long month name from date-----*/
var optiTravelDate = new Date('01/01/2018');
var optiTravelMonth = optiTravelDate.toLocaleString('en-us', {
    month: "long"
});


/*-----Smooth scroll function-----*/
function optiSideScroll(element, direction, speed, distance, step) {
    scrollAmount = 0;
    var slideTimer = setInterval(function () {
        if (direction == 'left') {
            element.scrollLeft -= step;
        } else {
            element.scrollLeft += step;
        }
        scrollAmount += step;
        if (scrollAmount >= distance) {
            window.clearInterval(slideTimer);
        }
    }, speed);
}


/*-----Delay function on hover events-----*/
function delay(element, callback) {
    var timeout = null;
    element.addEventListener('mouseover', function () {
        // Fires callback event after 600ms
        timeout = setTimeout(callback, 600);
    });

    // If mouse out then clear timeout (won't call the callback function)
    element.addEventListener('mouseout', function () {
        clearTimeout(timeout);
    });
}

/*-----Get search results through XHR request-----*/
var xmlhttp = new XMLHttpRequest();
var url = 'https://www.tui.co.uk/destinations/newDeals/customize';
xmlhttp.onreadystatechange = function() {
    /*Get the JSON data back and parse it into an object*/
    if (this.readyState == 4 && this.status == 200) {
	var respData = JSON.parse(this.responseText);
	test(respData);
    } else if (this.status == 404) {
	console.log("didn't load");
    }
};
var CSRFtoken = ''; // CSRFToken from customize XHR request on search results
var myobj = {}; // searchCriteria from customize XHR request on search results
var searchRequest = JSON.stringify(myobj);
searchRequest = encodeURIComponent(searchRequest);
/*Fire XHR request*/
xmlhttp.open('POST', url, true);
xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xmlhttp.send('CSRFtoken=' + CSRFtoken + '&searchCriteria=' + searchRequest);

function test(data) {
    console.log(data);
}

/*-----Detect if the browser is IE-----*/
function detectIE() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }
  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }
  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }
  // other browser
  return false;
}
